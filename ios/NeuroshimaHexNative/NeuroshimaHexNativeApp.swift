import SwiftUI
import UIKit

private let ironGangArmyId = "iron-gang"
private let merchantsGuildArmyId = "merchants-guild"
private let mgSquadLeaderTileId = "mg-squad-leader"
private let codeAlphabet = Array("23456789ABCDEFGHJKMNPQRSTUVWXYZ_")
private let codeBase: UInt32 = 32
private let codeLen = 6
private let saltRespawn1: UInt32 = 0x52e571
private let saltRespawn2: UInt32 = 0x52e572

private let wiremenBonusByTileId: [String: [String: Int]] = [
    "wiremen-sniper": ["ini0": 1],
    "wiremen-castling-ini": ["iniPlus1": 1],
    "wiremen-castling-matka": ["matka": 1],
    "wiremen-push-cios": ["meleePlus1": 1],
    "wiremen-push-matka": ["matka": 1],
    "wiremen-push-strzal": ["rangedPlus1": 1],
    "wiremen-move-cios": ["meleePlus1": 1],
    "wiremen-move-ini": ["iniPlus1": 1],
    "wiremen-move-matka": ["matka": 1],
    "wiremen-move-strzal": ["rangedPlus1": 1],
    "wiremen-battle-cios-ini": ["iniPlus1": 1, "meleePlus1": 1],
    "wiremen-battle-matka-cios": ["matka": 1, "meleePlus1": 1],
    "wiremen-battle-matka-strzal": ["matka": 1, "rangedPlus1": 1],
    "wiremen-battle-strzal-ini": ["iniPlus1": 1, "rangedPlus1": 1],
    "wiremen-battle-zero-ini": ["iniPlus1": 1, "ini0": 1],
]

private let hookSpecs: [HookReplacementSpec] = [
    .init(suffix: "1", replacedTileId: "ig-mountain", label: "Mountain"),
    .init(suffix: "2", replacedTileId: "ig-boss", label: "Boss"),
    .init(suffix: "3", replacedTileId: "ig-officer", label: "Officer"),
    .init(suffix: "4", replacedTileId: "ig-order", label: "Order"),
    .init(suffix: "5", replacedTileId: "ig-motorcyclist", label: "Biker"),
    .init(suffix: "6", replacedTileId: "ig-double-move", label: "Doubled Move"),
    .init(suffix: "7", replacedTileId: "ig-fanatic", label: "Fanatic"),
    .init(suffix: "8", replacedTileId: "ig-ranged-netter", label: "Ranged Net Fighter"),
    .init(suffix: "9", replacedTileId: "ig-lumberjack", label: "Lumberjack"),
]

enum LocaleCode: String, Codable {
    case en
    case pl
}

enum FeatureMode: String {
    case randomizer
    case counter
    case tileflip
    case selection
}

enum FlipPhase {
    case idle
    case animating
    case done
}

enum Screen {
    case home
    case army
    case setup
    case draw
    case counter
    case selectionReady
}

enum TileCategory: String, Codable {
    case hq
    case instant
    case soldier
    case implant
    case foundation
    case module
}

struct TileDefinition: Codable, Identifiable, Hashable {
    let id: String
    let name: String
    let category: TileCategory
    let count: Int
    let description: String?
    let imageUrl: String?
    let imageOverlayLabel: String?
    let excludeFromDeck: Bool?
    let displayWithHq: Bool?
}

struct Army: Codable, Identifiable, Hashable {
    let id: String
    let name: String
    let color: String
    let accentColor: String
    let description: String
    let hqAbility: String
    let hqImageUrl: String?
    let multiHeadquarters: Bool?
    let tiles: [TileDefinition]
}

struct TileInstance: Identifiable, Hashable {
    let id: String
    let tile: TileDefinition
    let armyId: String
}

struct DisplayData: Codable {
    let armyDisplayNamePl: [String: String]
    let armyDescriptionPl: [String: String]
    let armyHqAbilityPl: [String: String]
    let polishTileNameOverrides: [String: String]
    let enToPlTileNames: [String: String]
}

struct UiStrings: Codable {
    let en: [String: String]
    let pl: [String: String]
}

struct AppVersion: Codable {
    let appVersion: String
    let appVersionDate: String
    let appVersionFull: String
}

struct TileCategoryTheme: Codable {
    let cardBorder: String
    let cardChipBackground: String
    let cardChipBorder: String
    let cardChipText: String
    let badgeBackground: String
    let badgeText: String
    let fallbackBackground: String
}

struct AppTheme: Codable {
    let tileCategories: [String: TileCategoryTheme]
}

struct AppContent {
    let armies: [Army]
    let display: DisplayData
    let uiStrings: UiStrings
    let theme: AppTheme
    let version: AppVersion
}

struct HookReplacementSpec {
    let suffix: String
    let replacedTileId: String
    let label: String
}

struct TileGroup: Identifiable {
    let tile: TileDefinition
    let instances: [TileInstance]
    var id: String { tile.id }
}

@MainActor
final class AppModel: ObservableObject {
    @Published var locale: LocaleCode
    @Published var featureMode: FeatureMode = .randomizer
    @Published var screen: Screen = .home
    @Published var selectedArmyId: String?
    @Published var deckCode = ""
    @Published var counterAId: String?
    @Published var counterBId: String?
    @Published var selectionAId: String?
    @Published var selectionBId: String?

    let content: AppContent

    init() {
        let stored = UserDefaults.standard.string(forKey: "nh_native_locale")
        if stored == "pl" {
            locale = .pl
        } else if stored == "en" {
            locale = .en
        } else if Locale.current.language.languageCode?.identifier == "pl" {
            locale = .pl
        } else {
            locale = .en
        }
        content = BundleLoader.load()
    }

    func setLocale(_ next: LocaleCode) {
        locale = next
        UserDefaults.standard.set(next.rawValue, forKey: "nh_native_locale")
    }

    func t(_ key: String, _ params: [String: String] = [:]) -> String {
        let base = (locale == .pl ? content.uiStrings.pl[key] : content.uiStrings.en[key]) ?? content.uiStrings.en[key] ?? key
        return params.reduce(base) { partial, pair in
            partial.replacingOccurrences(of: "{\(pair.key)}", with: pair.value)
        }
    }

    var selectedArmy: Army? { armyById[selectedArmyId ?? ""] }
    var counterArmyA: Army? { armyById[counterAId ?? ""] }
    var counterArmyB: Army? { armyById[counterBId ?? ""] }
    var selectionArmyA: Army? { armyById[selectionAId ?? ""] }
    var selectionArmyB: Army? { armyById[selectionBId ?? ""] }

    var armyById: [String: Army] {
        Dictionary(uniqueKeysWithValues: content.armies.map { ($0.id, $0) })
    }

    func goHome() {
        if featureMode == .tileflip {
            featureMode = .randomizer
        }
        screen = .home
        selectedArmyId = nil
        deckCode = ""
        if featureMode != .counter {
            counterAId = nil
            counterBId = nil
        }
        if featureMode != .selection {
            selectionAId = nil
            selectionBId = nil
        }
    }

    func setFeatureMode(_ next: FeatureMode) {
        featureMode = next
        screen = .home
        selectedArmyId = nil
        deckCode = ""
        if next != .counter {
            counterAId = nil
            counterBId = nil
        }
        if next != .selection {
            selectionAId = nil
            selectionBId = nil
        }
    }

    func selectArmy(_ army: Army) {
        if featureMode == .counter {
            if counterAId == nil {
                counterAId = army.id
            } else if counterBId == nil && counterAId != army.id {
                counterBId = army.id
                screen = .counter
            }
            return
        }
        if featureMode == .selection {
            if selectionAId == army.id {
                selectionAId = selectionBId
                selectionBId = nil
            } else if selectionBId == army.id {
                selectionBId = nil
            } else if selectionAId == nil {
                selectionAId = army.id
            } else if selectionBId == nil {
                selectionBId = army.id
            }
            return
        }
        selectedArmyId = army.id
        screen = .army
    }

    func armyDisplayName(_ army: Army) -> String {
        if locale == .pl {
            return content.display.armyDisplayNamePl[army.id] ?? army.name
        }
        return army.name
    }

    func armyDescription(_ army: Army) -> String {
        if locale == .pl {
            return content.display.armyDescriptionPl[army.id] ?? army.description
        }
        return army.description
    }

    func armyHqAbility(_ army: Army) -> String {
        if locale == .pl {
            return content.display.armyHqAbilityPl[army.id] ?? army.hqAbility
        }
        return army.hqAbility
    }

    func tileDisplayName(_ tile: TileDefinition) -> String {
        guard locale == .pl else { return tile.name }
        if tile.name == "HQ" { return "Sztab" }
        return content.display.polishTileNameOverrides[tile.id] ?? content.display.enToPlTileNames[tile.name] ?? tile.name
    }

    func searchHaystack(_ army: Army) -> String {
        [army.name, content.display.armyDisplayNamePl[army.id]].compactMap { $0 }.joined(separator: " ").lowercased()
    }
}

enum BundleLoader {
    static func load() -> AppContent {
        let decoder = JSONDecoder()
        let armies = load("armies", as: [Army].self, decoder: decoder)
        let display = load("display", as: DisplayData.self, decoder: decoder)
        let strings = load("ui-strings", as: UiStrings.self, decoder: decoder)
        let theme = load("theme", as: AppTheme.self, decoder: decoder)
        let version = load("version", as: AppVersion.self, decoder: decoder)
        return AppContent(armies: armies, display: display, uiStrings: strings, theme: theme, version: version)
    }

    private static func load<T: Decodable>(_ name: String, as type: T.Type, decoder: JSONDecoder) -> T {
        guard let url = Bundle.main.url(forResource: name, withExtension: "json", subdirectory: "Generated"),
              let data = try? Data(contentsOf: url),
              let decoded = try? decoder.decode(type, from: data) else {
            fatalError("Missing bundled resource \(name).json")
        }
        return decoded
    }
}

@main
struct NeuroshimaHexNativeApp: App {
    @StateObject private var model = AppModel()

    var body: some Scene {
        WindowGroup {
            RootView()
                .environmentObject(model)
        }
    }
}

struct RootView: View {
    @EnvironmentObject private var model: AppModel

    var body: some View {
        VStack(spacing: 0) {
            header
            Group {
                if model.featureMode == .tileflip && model.screen == .home {
                    TileFlipView()
                } else {
                    switch model.screen {
                    case .home:
                        HomeView()
                    case .army:
                        if let army = model.selectedArmy {
                            ArmyDetailView(army: army)
                        }
                    case .setup:
                        if let army = model.selectedArmy {
                            DeckSetupView(army: army)
                        }
                    case .draw:
                        if let army = model.selectedArmy {
                            DrawView(army: army, deckCode: model.deckCode)
                        }
                    case .counter:
                        if let a = model.counterArmyA, let b = model.counterArmyB {
                            CounterView(armyA: a, armyB: b)
                        }
                    case .selectionReady:
                        if let a = model.selectionArmyA, let b = model.selectionArmyB {
                            SelectionReadyView(armyA: a, armyB: b)
                        }
                    }
                }
            }
            .frame(maxWidth: .infinity, maxHeight: .infinity)
            .background(Color.black)
        }
        .background(Color.black.ignoresSafeArea())
    }

    private var header: some View {
        HStack {
            Button(model.t("brandShort")) { model.goHome() }
                .foregroundStyle(.white)
                .font(.headline)
            Spacer()
            Button("EN") { model.setLocale(.en) }
                .buttonStyle(.bordered)
            Button("PL") { model.setLocale(.pl) }
                .buttonStyle(.bordered)
        }
        .padding()
        .background(Color(white: 0.12))
    }
}

struct HomeView: View {
    @EnvironmentObject private var model: AppModel
    @State private var query = ""

    var filteredArmies: [Army] {
        model.content.armies.filter { army in
            query.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty || model.searchHaystack(army).contains(query.lowercased())
        }
    }

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 16) {
                Text(model.t("homeHeroTitle"))
                    .font(.largeTitle.bold())
                    .foregroundStyle(.white)
                Text(model.t("homeHeroSubtitle"))
                    .foregroundStyle(.gray)

                featurePicker

                if model.featureMode == .counter {
                    VStack(alignment: .leading, spacing: 8) {
                        Text(model.t("counterTitle"))
                            .font(.headline)
                            .foregroundStyle(.white)
                        Text(counterPrompt)
                            .foregroundStyle(.gray)
                    }
                    .padding()
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .background(Color(white: 0.15), in: RoundedRectangle(cornerRadius: 16))
                }

                if model.featureMode == .selection {
                    VStack(alignment: .leading, spacing: 12) {
                        Text(model.t("homeFeatureSelection"))
                            .font(.headline)
                            .foregroundStyle(.white)
                        Text(selectionPrompt)
                            .foregroundStyle(.gray)
                        Button(model.t("homeSelectionReady")) {
                            model.screen = .selectionReady
                        }
                        .buttonStyle(.borderedProminent)
                        .disabled(model.selectionArmyA == nil || model.selectionArmyB == nil)
                    }
                    .padding()
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .background(Color(white: 0.15), in: RoundedRectangle(cornerRadius: 16))
                }

                TextField(model.t("homeSearchPlaceholder"), text: $query)
                    .textInputAutocapitalization(.never)
                    .autocorrectionDisabled()
                    .padding(12)
                    .background(Color(white: 0.17), in: RoundedRectangle(cornerRadius: 12))
                    .foregroundStyle(.white)

                if model.featureMode == .selection {
                    LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], spacing: 12) {
                        ForEach(filteredArmies) { army in
                            let selectedIndex: Int? =
                                model.selectionArmyA?.id == army.id ? 1 :
                                model.selectionArmyB?.id == army.id ? 2 : nil
                            let selectionAtLimit =
                                model.selectionArmyA != nil &&
                                model.selectionArmyB != nil &&
                                selectedIndex == nil
                            Button {
                                model.selectArmy(army)
                            } label: {
                                ArmySelectionCardView(
                                    army: army,
                                    selectedIndex: selectedIndex,
                                    disabled: selectionAtLimit
                                )
                            }
                            .disabled(selectionAtLimit)
                            .buttonStyle(.plain)
                        }
                    }
                } else {
                    ForEach(filteredArmies) { army in
                        let counterPickFirst = model.counterArmyA?.id == army.id
                        let counterBlockDuplicate =
                            model.featureMode == .counter &&
                            model.counterArmyA != nil &&
                            model.counterArmyB == nil &&
                            model.counterArmyA?.id == army.id
                        Button {
                            if !counterBlockDuplicate {
                                model.selectArmy(army)
                            }
                        } label: {
                            ArmyCardView(
                                army: army,
                                disabled: counterBlockDuplicate,
                                selectedRing: model.featureMode == .counter && counterPickFirst && model.counterArmyA != nil
                            )
                        }
                        .disabled(counterBlockDuplicate)
                        .buttonStyle(.plain)
                    }
                }

                VStack(alignment: .leading, spacing: 6) {
                    Text("About")
                        .font(.headline)
                        .foregroundStyle(.white)
                    Text("Native preview powered by generated shared content.")
                        .foregroundStyle(.gray)
                    Text("Web source version: \(model.content.version.appVersionFull)")
                        .foregroundStyle(.gray)
                        .font(.footnote)
                }
                .padding()
                .frame(maxWidth: .infinity, alignment: .leading)
                .background(Color(white: 0.13), in: RoundedRectangle(cornerRadius: 16))
            }
            .padding()
        }
    }

    private var counterPrompt: String {
        if model.counterAId == nil {
            return model.t("homeCounterStep1")
        }
        if model.counterBId == nil {
            return model.t("homeCounterStep2Prefix") + model.t("homeCounterStep2Emphasis") + model.t("homeCounterStep2Suffix")
        }
        if let a = model.counterArmyA, let b = model.counterArmyB {
            return "\(model.armyDisplayName(a)) vs \(model.armyDisplayName(b))"
        }
        return model.t("counterTitle")
    }

    private var selectionPrompt: String {
        if model.selectionArmyA == nil {
            return model.t("homeSelectionStep1")
        }
        if model.selectionArmyB == nil {
            return model.t("homeSelectionStep2")
        }
        return model.t("homeSelectionComplete")
    }

    private var featurePicker: some View {
        HStack(spacing: 8) {
            featureButton(.randomizer, key: "homeFeatureRandomizer")
            featureButton(.counter, key: "homeFeatureCounter")
            featureButton(.tileflip, key: "homeFeatureTileflip")
            featureButton(.selection, key: "homeFeatureSelection")
        }
    }

    private func featureButton(_ mode: FeatureMode, key: String) -> some View {
        Button(model.t(key)) {
            model.setFeatureMode(mode)
        }
        .padding(.vertical, 12)
        .frame(maxWidth: .infinity)
        .background(model.featureMode == mode ? Color.green.opacity(0.7) : Color(white: 0.18), in: RoundedRectangle(cornerRadius: 12))
        .foregroundStyle(.white)
    }
}

struct ArmyCardView: View {
    @EnvironmentObject private var model: AppModel
    let army: Army
    var disabled = false
    var selectedRing = false

    var body: some View {
        VStack(alignment: .leading, spacing: 10) {
            BundleAssetImage(repoPath: army.hqImageUrl)
                .frame(width: 96, height: 96)
                .background(Color(white: 0.22), in: RoundedRectangle(cornerRadius: 12))
            Text(model.armyDisplayName(army))
                .font(.title3.bold())
                .foregroundStyle(parseColor(army.accentColor))
            Text(model.armyDescription(army))
                .foregroundStyle(.gray)
                .lineLimit(3)
            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 6) {
                    ForEach(deckCountsByCategory(army), id: \.key) { category, count in
                        if let theme = model.content.theme.tileCategories[category.rawValue] {
                            Text(model.t(categoryDeckLabelKey(category), ["n": "\(count)"]))
                                .foregroundStyle(parseColor(theme.cardChipText))
                                .lineLimit(1)
                                .fixedSize(horizontal: true, vertical: false)
                                .padding(.horizontal, 10)
                                .padding(.vertical, 6)
                                .background(parseColor(theme.cardChipBackground), in: Capsule())
                                .overlay(
                                    Capsule().stroke(parseColor(theme.cardChipBorder), lineWidth: 1)
                                )
                        }
                    }
                }
            }
        }
        .padding()
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(Color(white: 0.13), in: RoundedRectangle(cornerRadius: 16))
        .overlay(
            RoundedRectangle(cornerRadius: 16)
                .stroke(selectedRing ? Color.yellow.opacity(0.7) : Color.clear, lineWidth: 2)
        )
        .opacity(disabled ? 0.4 : 1)
    }
}

struct ArmySelectionCardView: View {
    @EnvironmentObject private var model: AppModel
    let army: Army
    let selectedIndex: Int?
    var disabled = false

    var body: some View {
        VStack(spacing: 10) {
            ZStack(alignment: .topTrailing) {
                BundleAssetImage(repoPath: army.hqImageUrl)
                    .frame(width: 96, height: 96)
                    .background(Color(white: 0.22), in: RoundedRectangle(cornerRadius: 14))

                if let selectedIndex {
                    Text("\(selectedIndex)")
                        .font(.caption.bold())
                        .foregroundStyle(Color(red: 0.11, green: 0.10, blue: 0.09))
                        .frame(width: 28, height: 28)
                        .background(Color(red: 0.96, green: 0.62, blue: 0.04), in: Circle())
                        .overlay(Circle().stroke(Color(red: 0.99, green: 0.88, blue: 0.51).opacity(0.45), lineWidth: 1))
                        .offset(x: 8, y: -8)
                }
            }

            Text(model.armyDisplayName(army))
                .font(.headline)
                .foregroundStyle(.white)
                .multilineTextAlignment(.center)
                .lineLimit(2)
        }
        .frame(maxWidth: .infinity)
        .padding()
        .background(Color(white: 0.13), in: RoundedRectangle(cornerRadius: 16))
        .overlay(
            RoundedRectangle(cornerRadius: 16)
                .stroke(selectedIndex != nil ? Color.yellow.opacity(0.7) : Color.clear, lineWidth: 2)
        )
        .opacity(disabled ? 0.4 : 1)
    }
}

struct SelectionReadyView: View {
    @EnvironmentObject private var model: AppModel
    let armyA: Army
    let armyB: Army
    @State private var revealed = false

    var body: some View {
        ScrollView {
            VStack(spacing: 16) {
                VStack(spacing: 12) {
                    Text(model.t("selectionReadyTitle"))
                        .font(.largeTitle.bold())
                        .foregroundStyle(.white)
                        .multilineTextAlignment(.center)
                    Text(model.t("selectionReadySubtitle"))
                        .foregroundStyle(.gray)
                        .multilineTextAlignment(.center)
                    Button(model.t(revealed ? "selectionHideButton" : "selectionRevealButton")) {
                        revealed.toggle()
                    }
                    .buttonStyle(.borderedProminent)
                }
                .padding()
                .frame(maxWidth: .infinity)
                .background(Color(white: 0.13), in: RoundedRectangle(cornerRadius: 18))

                if revealed {
                    SelectionRevealCardView(army: armyA, position: 1)
                    SelectionRevealCardView(army: armyB, position: 2)
                }
            }
            .padding()
        }
    }
}

struct SelectionRevealCardView: View {
    @EnvironmentObject private var model: AppModel
    let army: Army
    let position: Int

    private var markerBackground: Color {
        position == 1 ? .white : Color(red: 0.22, green: 0.25, blue: 0.31)
    }

    private var markerBorder: Color {
        position == 1 ? .white.opacity(0.7) : Color(red: 0.36, green: 0.40, blue: 0.44).opacity(0.9)
    }

    private var markerText: Color {
        position == 1 ? Color(red: 0.07, green: 0.09, blue: 0.15) : Color(red: 0.9, green: 0.92, blue: 0.94)
    }

    var body: some View {
        VStack(spacing: 16) {
            HStack(spacing: 16) {
                Text("\(position)")
                    .font(.system(size: 40, weight: .black))
                    .foregroundStyle(markerText)
                    .frame(width: 96, height: 96)
                    .background(markerBackground, in: RoundedRectangle(cornerRadius: 20))
                    .overlay(
                        RoundedRectangle(cornerRadius: 20)
                            .stroke(markerBorder, lineWidth: 2)
                    )

                BundleAssetImage(repoPath: army.hqImageUrl)
                    .frame(width: 96, height: 96)
                    .background(Color(white: 0.22), in: RoundedRectangle(cornerRadius: 20))
            }

            Text(model.armyDisplayName(army))
                .font(.title2.bold())
                .foregroundStyle(parseColor(army.accentColor))
                .multilineTextAlignment(.center)
        }
        .frame(maxWidth: .infinity)
        .padding()
        .background(Color(white: 0.13), in: RoundedRectangle(cornerRadius: 18))
    }
}

struct ArmyDetailView: View {
    @EnvironmentObject private var model: AppModel
    let army: Army

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 16) {
                Text(model.armyDisplayName(army))
                    .font(.largeTitle.bold())
                    .foregroundStyle(parseColor(army.accentColor))
                Text(model.armyDescription(army))
                    .foregroundStyle(.gray)
                VStack(alignment: .leading, spacing: 8) {
                    Text(model.t("armyHqSpecial"))
                        .font(.headline)
                        .foregroundStyle(.yellow)
                    Text(model.armyHqAbility(army))
                        .foregroundStyle(.white)
                }
                .padding()
                .frame(maxWidth: .infinity, alignment: .leading)
                .background(Color(red: 0.18, green: 0.15, blue: 0.09), in: RoundedRectangle(cornerRadius: 16))

                Button(model.t("armyStartDraw")) { model.screen = .setup }
                    .buttonStyle(.borderedProminent)
                    .tint(parseColor(army.accentColor))

                ForEach(tileSections(for: army), id: \.0) { title, tiles in
                    VStack(alignment: .leading, spacing: 8) {
                        Text(title)
                            .font(.headline)
                            .foregroundStyle(.white)
                        ForEach(tiles) { tile in
                            TileRowView(title: model.tileDisplayName(tile), subtitle: tile.description, imageUrl: tile.imageUrl)
                        }
                    }
                }
            }
            .padding()
        }
    }
}

struct DeckSetupView: View {
    @EnvironmentObject private var model: AppModel
    let army: Army

    @State private var mode = "new"
    @State private var code: String
    @State private var input = ""
    @State private var error = ""

    init(army: Army) {
        self.army = army
        _code = State(initialValue: army.id == ironGangArmyId ? generateIronGangDeckCode() : generateCode())
    }

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 16) {
                Button(model.t("deckBack")) { model.screen = .army }
                    .buttonStyle(.bordered)
                Text(model.t("deckTitle"))
                    .font(.largeTitle.bold())
                    .foregroundStyle(.white)
                Text(army.id == ironGangArmyId ? model.t("deckBlurbIronGang") : model.t("deckBlurbStandard"))
                    .foregroundStyle(.gray)
                HStack(spacing: 8) {
                    modeButton("new", label: model.t("deckModeNew"))
                    modeButton("join", label: model.t("deckModeJoin"))
                }
                if mode == "new" {
                    CodeRowView(code: code)
                    HStack {
                        Button(model.t("deckRegenerate")) {
                            code = army.id == ironGangArmyId ? generateIronGangDeckCode() : generateCode()
                        }
                        .buttonStyle(.bordered)
                        Button(model.t("deckCopy")) {
                            UIPasteboard.general.string = code
                        }
                        .buttonStyle(.bordered)
                    }
                } else {
                    TextField(model.t("deckEnterCode"), text: $input)
                        .textInputAutocapitalization(.characters)
                        .autocorrectionDisabled()
                        .padding(12)
                        .background(Color(white: 0.16), in: RoundedRectangle(cornerRadius: 12))
                        .foregroundStyle(.white)
                        .onChange(of: input) { _, next in
                            let allowed = army.id == ironGangArmyId ? "0123456789ABCDEFGHJKMNPQRSTUVWXYZ_" : String(codeAlphabet)
                            input = String(next.uppercased().filter { allowed.contains($0) }.prefix(army.id == ironGangArmyId ? 7 : 6))
                            error = ""
                        }
                    if !error.isEmpty {
                        Text(error).foregroundStyle(.red)
                    }
                }
                Button(model.t("deckStartDrawing")) {
                    if mode == "new" {
                        model.deckCode = code
                        model.screen = .draw
                    } else {
                        let len = army.id == ironGangArmyId ? 7 : 6
                        if input.count != len {
                            error = model.t("deckErrorCodeLength", ["len": "\(len)"])
                        } else if army.id == ironGangArmyId && parseIronGangDeckCode(input) == nil {
                            error = model.t("deckErrorInvalid")
                        } else if army.id != ironGangArmyId && codeToSeed(input) == nil {
                            error = model.t("deckErrorInvalid")
                        } else {
                            model.deckCode = input
                            model.screen = .draw
                        }
                    }
                }
                .buttonStyle(.borderedProminent)
            }
            .padding()
        }
    }

    private func modeButton(_ value: String, label: String) -> some View {
        Button(label) {
            mode = value
            error = ""
        }
        .padding(.vertical, 12)
        .frame(maxWidth: .infinity)
        .background(mode == value ? Color.green.opacity(0.7) : Color(white: 0.18), in: RoundedRectangle(cornerRadius: 12))
        .foregroundStyle(.white)
    }
}

struct DrawView: View {
    @EnvironmentObject private var model: AppModel
    let army: Army
    let deckCode: String

    @State private var deck: [TileInstance]
    @State private var drawIndex = 0
    @State private var mgRecon1Shuffled = false
    @State private var mgRecon2Shuffled = false

    init(army: Army, deckCode: String) {
        self.army = army
        self.deckCode = deckCode
        _deck = State(initialValue: buildShuffledDeck(army: army, deckCode: deckCode))
    }

    var drawn: [TileInstance] { Array(deck.prefix(drawIndex)) }
    var remaining: [TileInstance] { Array(deck.dropFirst(drawIndex)) }
    private let tileGridColumns = [GridItem(.adaptive(minimum: 124), spacing: 8)]

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 16) {
                HStack {
                    Button(model.t("drawBack")) { model.goHome() }
                        .buttonStyle(.bordered)
                    Button(model.t("drawReset")) {
                        deck = buildShuffledDeck(army: army, deckCode: deckCode)
                        drawIndex = 0
                        mgRecon1Shuffled = false
                        mgRecon2Shuffled = false
                    }
                    .buttonStyle(.bordered)
                }

                if army.id == merchantsGuildArmyId {
                    Text(model.t("drawMgBanner"))
                        .foregroundStyle(.gray)
                }
                if army.id == ironGangArmyId, let mode = parseIronGangDeckCode(deckCode) {
                    Text(ironGangBanner(mode: mode, army: army, locale: model.locale, display: model.content.display))
                        .foregroundStyle(.gray)
                }

                CodeRowView(code: deckCode)

                HStack {
                    Button(model.t("drawCopy")) {
                        UIPasteboard.general.string = deckCode
                    }
                    .buttonStyle(.bordered)
                    Button(model.t("drawChangeCode")) { model.screen = .setup }
                        .buttonStyle(.bordered)
                }

                Text(model.t("drawLeft", ["n": "\(remaining.count)", "total": "\(deck.count)"]))
                    .foregroundStyle(.white)

                Button(drawIndex == 0 ? model.t("drawFirstTile") : model.t("drawTileLeft", ["n": "\(deck.count - drawIndex)"])) {
                    if drawIndex < deck.count { drawIndex += 1 }
                }
                .buttonStyle(.borderedProminent)
                .disabled(drawIndex >= deck.count)

                if army.id == merchantsGuildArmyId {
                    let squadLeaders = drawn.filter { $0.tile.id == mgSquadLeaderTileId }.count
                    if squadLeaders >= 1 && !mgRecon1Shuffled {
                        Button(model.t("drawShuffleRecon1")) {
                            deck = insertMerchantsGuildReconnaissance(deck: deck, firstRemainingIndex: drawIndex, which: 1, armyId: army.id, seed: codeToSeed(deckCode), imageUrl: army.tiles.first(where: { $0.id == mgSquadLeaderTileId })?.imageUrl)
                            mgRecon1Shuffled = true
                        }
                        .buttonStyle(.bordered)
                    }
                    if squadLeaders >= 2 && !mgRecon2Shuffled {
                        Button(model.t("drawShuffleRecon2")) {
                            deck = insertMerchantsGuildReconnaissance(deck: deck, firstRemainingIndex: drawIndex, which: 2, armyId: army.id, seed: codeToSeed(deckCode), imageUrl: army.tiles.first(where: { $0.id == mgSquadLeaderTileId })?.imageUrl)
                            mgRecon2Shuffled = true
                        }
                        .buttonStyle(.bordered)
                    }
                }

                if let last = drawn.last {
                    VStack(alignment: .leading, spacing: 8) {
                        Text(model.t("drawLastDrawn", ["i": "\(drawIndex)", "total": "\(deck.count)"]))
                            .foregroundStyle(.gray)
                            .font(.caption.weight(.semibold))
                        NativeTileCardView(
                            tile: last.tile,
                            title: model.tileDisplayName(last.tile),
                            categoryLabel: model.t(categoryLabelKey(last.tile.category)),
                            theme: model.content.theme.tileCategories[last.tile.category.rawValue],
                            count: 1,
                            spotlight: true
                        )
                    }
                }

                Text(model.t("drawDrawnSection", ["n": "\(drawn.count)"]))
                    .font(.headline)
                    .foregroundStyle(.white)
                LazyVGrid(columns: tileGridColumns, alignment: .leading, spacing: 8) {
                    ForEach(Array(drawn.reversed().enumerated()), id: \.element.id) { index, tile in
                        NativeTileCardView(
                            tile: tile.tile,
                            title: model.tileDisplayName(tile.tile),
                            categoryLabel: model.t(categoryLabelKey(tile.tile.category)),
                            theme: model.content.theme.tileCategories[tile.tile.category.rawValue],
                            count: 1,
                            small: true,
                            dimmed: index > 0
                        )
                    }
                }
            }
            .padding()
        }
    }
}

struct CounterView: View {
    @EnvironmentObject private var model: AppModel
    let armyA: Army
    let armyB: Army

    @State private var resetVersion = 0
    @State private var stackIdentical = true

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 16) {
                HStack {
                    Button(model.t("counterBackArmies")) {
                        model.screen = .home
                        model.counterAId = nil
                        model.counterBId = nil
                    }
                    .buttonStyle(.bordered)
                    Button(model.t("counterResetBoth")) { resetVersion += 1 }
                        .buttonStyle(.bordered)
                }

                Toggle(model.t("counterStackIdentical"), isOn: $stackIdentical)
                    .tint(.green)
                    .foregroundStyle(.white)

                CounterArmyPane(army: armyA, stackIdentical: stackIdentical, resetVersion: resetVersion)
                CounterArmyPane(army: armyB, stackIdentical: stackIdentical, resetVersion: resetVersion)
            }
            .padding()
        }
    }
}

struct CounterArmyPane: View {
    @EnvironmentObject private var model: AppModel
    let army: Army
    let stackIdentical: Bool
    let resetVersion: Int

    @State private var remaining: [TileInstance]
    @State private var drawn: [TileInstance] = []
    private let tileGridColumns = [GridItem(.adaptive(minimum: 124), spacing: 8)]

    init(army: Army, stackIdentical: Bool, resetVersion: Int) {
        self.army = army
        self.stackIdentical = stackIdentical
        self.resetVersion = resetVersion
        _remaining = State(initialValue: buildDeck(army: army))
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text(model.armyDisplayName(army))
                .font(.title2.bold())
                .foregroundStyle(parseColor(army.accentColor))
            Text(model.t("counterDrawnOfTotal", ["drawn": "\(drawn.count)", "total": "\(drawn.count + remaining.count)"]))
                .foregroundStyle(.gray)

            if army.id == "wiremen" {
                VStack(alignment: .leading, spacing: 6) {
                    ForEach(Array(wiremenTechBonusesRemaining(remaining).keys.sorted()), id: \.self) { key in
                        Text("\(key): \(wiremenTechBonusesRemaining(remaining)[key] ?? 0)")
                            .foregroundStyle(.white)
                            .padding(.horizontal, 10)
                            .padding(.vertical, 6)
                            .background(Color.teal.opacity(0.5), in: Capsule())
                    }
                }
            }

            Text(model.t("counterRemaining", ["n": "\(remaining.count)"]))
                .font(.headline)
                .foregroundStyle(.white)
            LazyVGrid(columns: tileGridColumns, alignment: .leading, spacing: 8) {
                ForEach(sortedCounterGroups(from: remaining, stackIdentical: stackIdentical)) { group in
                    NativeTileCardView(
                        tile: group.tile,
                        title: model.tileDisplayName(group.tile),
                        categoryLabel: model.t(categoryLabelKey(group.tile.category)),
                        theme: model.content.theme.tileCategories[group.tile.category.rawValue],
                        count: group.instances.count,
                        countInParentheses: stackIdentical && group.instances.count > 1,
                        small: true,
                        onTap: {
                            guard let picked = group.instances.first else { return }
                            remaining.removeAll { $0.id == picked.id }
                            drawn.append(picked)
                        }
                    )
                }
            }

            Text(model.t("counterDrawn", ["n": "\(drawn.count)"]))
                .font(.headline)
                .foregroundStyle(.white)
            LazyVGrid(columns: tileGridColumns, alignment: .leading, spacing: 8) {
                ForEach(sortedCounterGroups(from: drawn, stackIdentical: stackIdentical)) { group in
                    NativeTileCardView(
                        tile: group.tile,
                        title: model.tileDisplayName(group.tile),
                        categoryLabel: model.t(categoryLabelKey(group.tile.category)),
                        theme: model.content.theme.tileCategories[group.tile.category.rawValue],
                        count: group.instances.count,
                        countInParentheses: stackIdentical && group.instances.count > 1,
                        small: true,
                        drawnOverlay: true,
                        onTap: {
                            guard let picked = group.instances.last else { return }
                            drawn.removeAll { $0.id == picked.id }
                            remaining.insert(picked, at: 0)
                        }
                    )
                }
            }
        }
        .padding()
        .background(Color(white: 0.12), in: RoundedRectangle(cornerRadius: 18))
        .onChange(of: resetVersion) { _, _ in
            remaining = buildDeck(army: army)
            drawn = []
        }
    }
}

struct TileFlipView: View {
    @EnvironmentObject private var model: AppModel
    @State private var phase: FlipPhase = .idle
    @State private var result: String?
    @State private var pendingWinner: String?
    @State private var animationStartedAt = Date()

    var body: some View {
        VStack(spacing: 20) {
            Button(model.t("counterBackArmies")) {
                model.goHome()
            }
            .buttonStyle(.bordered)
            Text(model.t("flipTitle"))
                .font(.largeTitle.bold())
                .foregroundStyle(.white)
            Text(model.t("flipSubtitle"))
                .foregroundStyle(.gray)
                .multilineTextAlignment(.center)
            TimelineView(.animation) { context in
                let elapsed = phase == .animating ? context.date.timeIntervalSince(animationStartedAt) : 0
                HStack(spacing: 16) {
                    flipChoice(
                        imagePath: "src/assets/beasts/bestie-sep.png",
                        label: model.t("flipVulture"),
                        highlighted: phase == .done && result == model.t("flipVulture"),
                        dimmed: phase == .done && result == model.t("flipTails"),
                        transform: flipTransform(elapsed: elapsed, variant: .vulture)
                    )
                    flipChoice(
                        imagePath: "src/assets/beasts/bestie-sztab.png",
                        label: model.t("flipTails"),
                        highlighted: phase == .done && result == model.t("flipTails"),
                        dimmed: phase == .done && result == model.t("flipVulture"),
                        transform: flipTransform(elapsed: elapsed, variant: .tails)
                    )
                }
            }
            Button(buttonLabel) {
                pendingWinner = Bool.random() ? model.t("flipVulture") : model.t("flipTails")
                result = nil
                animationStartedAt = Date()
                phase = .animating
            }
            .buttonStyle(.borderedProminent)
            .disabled(phase == .animating)
            if phase == .done, let result {
                Text("\(model.t("flipResult")) \(result)")
                    .foregroundStyle(.white)
                    .font(.headline)
            }
        }
        .padding()
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .task(id: phase) {
            guard phase == .animating else { return }
            try? await Task.sleep(for: .seconds(3))
            guard phase == .animating else { return }
            result = pendingWinner
            phase = .done
        }
    }

    private var buttonLabel: String {
        switch phase {
        case .idle: return model.t("flipButton")
        case .animating: return model.t("flipAnimating")
        case .done: return model.t("flipAgain")
        }
    }

    private func flipChoice(imagePath: String, label: String, highlighted: Bool, dimmed: Bool, transform: FlipTransform) -> some View {
        VStack(spacing: 8) {
            BundleAssetImage(repoPath: imagePath)
                .frame(width: 140, height: 140)
                .background(highlighted ? Color.green.opacity(0.35) : Color(white: 0.16), in: RoundedRectangle(cornerRadius: 16))
                .scaleEffect(transform.scale)
                .rotationEffect(.degrees(transform.rotation))
                .offset(x: transform.dx, y: transform.dy)
                .opacity(dimmed ? 0.7 : 1)
            Text(label)
                .foregroundStyle(.white)
        }
    }

    private func flipTransform(elapsed: TimeInterval, variant: FlipVariant) -> FlipTransform {
        switch phase {
        case .idle:
            return .identity
        case .animating:
            let t = elapsed
            if variant == .vulture {
                return FlipTransform(
                    dx: sin(t * 2.1) * 6,
                    dy: cos(t * 1.85) * 4.5,
                    rotation: sin(t * 2.4) * 2.5,
                    scale: 1
                )
            } else {
                return FlipTransform(
                    dx: sin(t * 1.95 + 1.1) * 6,
                    dy: cos(t * 2.05 + 0.7) * 4.5,
                    rotation: sin(t * 2.35 + 0.9) * 2.5,
                    scale: 1
                )
            }
        case .done:
            let winnerMatches = (variant == .vulture && result == model.t("flipVulture")) || (variant == .tails && result == model.t("flipTails"))
            return FlipTransform(dx: 0, dy: 0, rotation: 0, scale: winnerMatches ? 1.2 : 0.78)
        }
    }
}

private enum FlipVariant {
    case vulture
    case tails
}

private struct FlipTransform {
    let dx: CGFloat
    let dy: CGFloat
    let rotation: Double
    let scale: CGFloat

    static let identity = FlipTransform(dx: 0, dy: 0, rotation: 0, scale: 1)
}

struct TileRowView: View {
    let title: String
    let subtitle: String?
    let imageUrl: String?

    var body: some View {
        HStack(spacing: 12) {
            BundleAssetImage(repoPath: imageUrl)
                .frame(width: 72, height: 72)
                .background(Color(white: 0.22), in: RoundedRectangle(cornerRadius: 12))
            VStack(alignment: .leading, spacing: 4) {
                Text(title)
                    .foregroundStyle(.white)
                    .font(.headline)
                if let subtitle, !subtitle.isEmpty {
                    Text(subtitle)
                        .foregroundStyle(.gray)
                        .font(.subheadline)
                }
            }
            Spacer()
        }
        .padding()
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(Color(white: 0.14), in: RoundedRectangle(cornerRadius: 16))
    }
}

struct NativeTileCardView: View {
    let tile: TileDefinition
    let title: String
    let categoryLabel: String
    let theme: TileCategoryTheme?
    var count: Int
    var countInParentheses = false
    var small = false
    var spotlight = false
    var drawnOverlay = false
    var dimmed = false
    var onTap: (() -> Void)? = nil

    private var displayTitle: String {
        countInParentheses && count > 1 ? "\(title) (\(count))" : title
    }

    private var cardWidth: CGFloat {
        spotlight ? 156 : (small ? 124 : 144)
    }

    private var imageHeight: CGFloat {
        spotlight ? 176 : (small ? 80 : 128)
    }

    private var borderColor: Color { parseColor(theme?.cardBorder ?? "#4a4a4a") }
    private var badgeBackground: Color { parseColor(theme?.badgeBackground ?? "#6e8b3d") }
    private var badgeText: Color { parseColor(theme?.badgeText ?? "#000000") }
    private var fallbackBackground: Color { parseColor(theme?.fallbackBackground ?? "#2b2b2b") }

    var body: some View {
        Button(action: { onTap?() }) {
            VStack(alignment: .leading, spacing: 0) {
                ZStack {
                    RoundedRectangle(cornerRadius: 10)
                        .fill(tile.imageUrl == nil ? fallbackBackground : .clear)
                    if let overlay = tile.imageOverlayLabel, !overlay.isEmpty, tile.imageUrl != nil {
                        ZStack {
                            BundleAssetImage(repoPath: tile.imageUrl)
                                .opacity(0.22)
                            RoundedRectangle(cornerRadius: 10)
                                .fill(Color.black.opacity(0.65))
                            Text(overlay)
                                .foregroundStyle(.white)
                                .font((spotlight ? Font.system(size: 34, weight: .black) : (small ? .system(size: 16, weight: .black) : .system(size: 24, weight: .black))))
                        }
                    } else if tile.imageUrl != nil {
                        BundleAssetImage(repoPath: tile.imageUrl)
                    } else {
                        Text(tileCategoryIcon(tile.category))
                            .foregroundStyle(Color(white: 0.7))
                            .font(spotlight ? .system(size: 42) : (small ? .system(size: 28) : .system(size: 38)))
                    }
                }
                .frame(height: imageHeight)
                .padding(small ? 4 : 8)

                HStack(spacing: 6) {
                    Text(displayTitle)
                        .foregroundStyle(.white)
                        .font(small ? .caption.weight(.semibold) : .subheadline.weight(.semibold))
                        .lineLimit(1)
                        .truncationMode(.tail)
                    Spacer(minLength: 0)
                    if !countInParentheses && count > 1 {
                        Text("×\(count)")
                            .foregroundStyle(badgeText)
                            .font(.caption2.weight(.bold))
                            .padding(.horizontal, 6)
                            .padding(.vertical, 2)
                            .background(badgeBackground, in: Capsule())
                    }
                }
                .padding(.horizontal, 8)
                .padding(.vertical, 6)
                .background(Color.black.opacity(0.35))

                if !small {
                    Text(categoryLabel)
                        .foregroundStyle(badgeText)
                        .font(.caption2.weight(.medium))
                        .padding(.horizontal, 6)
                        .padding(.vertical, 3)
                        .background(badgeBackground, in: RoundedRectangle(cornerRadius: 6))
                        .padding(.horizontal, 8)
                        .padding(.bottom, 8)
                }
            }
            .frame(width: cardWidth, alignment: .leading)
            .background(Color(red: 0.11, green: 0.10, blue: 0.09), in: RoundedRectangle(cornerRadius: 14))
            .overlay(
                RoundedRectangle(cornerRadius: 14)
                    .stroke(borderColor, lineWidth: 1)
            )
            .overlay(
                RoundedRectangle(cornerRadius: 14)
                    .fill(drawnOverlay ? Color.red.opacity(0.10) : .clear)
            )
            .opacity(dimmed ? 0.3 : 1)
            .scaleEffect(dimmed ? 0.95 : 1)
        }
        .buttonStyle(.plain)
        .disabled(onTap == nil)
    }
}

struct BundleAssetImage: View {
    let repoPath: String?

    var body: some View {
        if let image = loadImage() {
            Image(uiImage: image)
                .resizable()
                .scaledToFit()
        } else {
            Text("•")
                .foregroundStyle(.white)
        }
    }

    private func loadImage() -> UIImage? {
        guard let repoPath else { return nil }
        let relative = repoPath.replacingOccurrences(of: "src/assets/", with: "")
        let nsRelative = relative as NSString
        let directory = "Images/\(nsRelative.deletingLastPathComponent)"
        let filename = nsRelative.lastPathComponent as NSString
        let name = filename.deletingPathExtension
        let ext = filename.pathExtension

        if let direct = Bundle.main.path(forResource: name, ofType: ext.isEmpty ? nil : ext, inDirectory: directory) {
            return UIImage(contentsOfFile: direct)
        }
        if let base = Bundle.main.resourceURL {
            let url = base.appendingPathComponent("Images").appendingPathComponent(relative)
            return UIImage(contentsOfFile: url.path)
        }
        return nil
    }
}

struct CodeRowView: View {
    let code: String

    var body: some View {
        HStack(spacing: 8) {
            ForEach(Array(code.enumerated()), id: \.offset) { _, char in
                Text(String(char))
                    .font(.headline.monospaced())
                    .foregroundStyle(.white)
                    .padding(.horizontal, 12)
                    .padding(.vertical, 14)
                    .background(Color(white: 0.18), in: RoundedRectangle(cornerRadius: 12))
            }
        }
    }
}

private func buildDeck(army: Army) -> [TileInstance] {
    army.tiles.flatMap { tile in
        guard tile.excludeFromDeck != true else { return [TileInstance]() }
        return (0..<tile.count).map { index in
            TileInstance(id: "\(tile.id)-\(index)", tile: tile, armyId: army.id)
        }
    }
}

private func generateCode() -> String {
    seedToCode(UInt32.random(in: 0...UInt32.max))
}

private func generateIronGangDeckCode() -> String {
    let suffixes = ["0"] + hookSpecs.map(\.suffix)
    return seedToCode(UInt32.random(in: 0...UInt32.max)) + (suffixes.randomElement() ?? "0")
}

private func seedToCode(_ seed: UInt32) -> String {
    var n = seed
    var code = ""
    for _ in 0..<codeLen {
        code = String(codeAlphabet[Int(n % codeBase)]) + code
        n /= codeBase
    }
    return code
}

private func codeToSeed(_ code: String) -> UInt32? {
    let normalized = code.uppercased().trimmingCharacters(in: .whitespacesAndNewlines)
    guard normalized.count >= codeLen else { return nil }
    var n: UInt32 = 0
    for char in normalized.prefix(codeLen) {
        guard let idx = codeAlphabet.firstIndex(of: char) else { return nil }
        n = n * codeBase + UInt32(codeAlphabet.distance(from: codeAlphabet.startIndex, to: idx))
    }
    return n
}

private func mulberry32(seed: UInt32) -> () -> Double {
    var s = seed
    return {
        s &+= 0x6d2b79f5
        var t = (s ^ (s >> 15)) &* (1 | s)
        t = (t &+ ((t ^ (t >> 7)) &* (61 | t))) ^ t
        return Double((t ^ (t >> 14))) / 4294967296.0
    }
}

private func seededShuffle<T>(_ input: [T], seed: UInt32) -> [T] {
    var copy = input
    let rand = mulberry32(seed: seed)
    for index in stride(from: copy.count - 1, through: 1, by: -1) {
        let swapIndex = Int(rand() * Double(index + 1))
        copy.swapAt(index, swapIndex)
    }
    return copy
}

private func parseIronGangDeckCode(_ code: String) -> String? {
    let normalized = code.uppercased().trimmingCharacters(in: .whitespacesAndNewlines)
    guard normalized.count == 7, codeToSeed(normalized) != nil else { return nil }
    if normalized.last == "0" { return "no-hook" }
    guard let suffix = normalized.last.map(String.init),
          let spec = hookSpecs.first(where: { $0.suffix == suffix }) else { return nil }
    return "replace:\(spec.replacedTileId)"
}

private func buildShuffledDeck(army: Army, deckCode: String) -> [TileInstance] {
    var base = buildDeck(army: army)
    if army.id == ironGangArmyId, let mode = parseIronGangDeckCode(deckCode) {
        base = applyIronGangHookMode(deck: base, mode: mode)
    }
    guard let seed = codeToSeed(deckCode) else { return base }
    return seededShuffle(base, seed: seed)
}

private func applyIronGangHookMode(deck: [TileInstance], mode: String) -> [TileInstance] {
    if mode == "no-hook" {
        return deck.filter { $0.tile.id != "ig-hook" }
    }
    let replacedTileId = mode.replacingOccurrences(of: "replace:", with: "")
    guard let index = deck.firstIndex(where: { $0.tile.id == replacedTileId }) else { return deck }
    var copy = deck
    copy.remove(at: index)
    return copy
}

private func insertMerchantsGuildReconnaissance(
    deck: [TileInstance],
    firstRemainingIndex: Int,
    which: Int,
    armyId: String,
    seed: UInt32?,
    imageUrl: String?
) -> [TileInstance] {
    guard armyId == merchantsGuildArmyId else { return deck }
    let remaining = deck.count - firstRemainingIndex
    let rand = seed.map { mulberry32(seed: $0 ^ (which == 1 ? saltRespawn1 : saltRespawn2)) } ?? { Double.random(in: 0..<1) }
    let offset = remaining == 0 ? 0 : Int(rand() * Double(remaining + 1))
    let insertAt = firstRemainingIndex + offset
    let tile = TileDefinition(
        id: "mg-respawn-\(which)",
        name: which == 1 ? "Reconnaissance 1" : "Reconnaissance 2",
        category: .instant,
        count: 1,
        description: "Random mode only",
        imageUrl: imageUrl,
        imageOverlayLabel: which == 1 ? "RC1" : "RC2",
        excludeFromDeck: false,
        displayWithHq: false
    )
    let instance = TileInstance(id: "mg-respawn-\(which)-0", tile: tile, armyId: armyId)
    var copy = deck
    copy.insert(instance, at: insertAt)
    return copy
}

private func ironGangBanner(mode: String, army: Army, locale: LocaleCode, display: DisplayData) -> String {
    if mode == "no-hook" { return "This deck does not contain Hook." }
    let replacedTileId = mode.replacingOccurrences(of: "replace:", with: "")
    let tile = army.tiles.first(where: { $0.id == replacedTileId })
    let name: String
    if locale == .pl, let tile {
        name = display.polishTileNameOverrides[tile.id] ?? display.enToPlTileNames[tile.name] ?? tile.name
    } else {
        name = tile?.name ?? replacedTileId
    }
    return "This deck contains Hook. One \(name) was removed so Hook can be shuffled instead."
}

private func wiremenTechBonusesRemaining(_ remaining: [TileInstance]) -> [String: Int] {
    var out: [String: Int] = [
        "ini0": 0,
        "iniPlus1": 0,
        "matka": 0,
        "meleePlus1": 0,
        "rangedPlus1": 0,
    ]
    for instance in remaining where instance.tile.category == .instant {
        for (key, value) in wiremenBonusByTileId[instance.tile.id] ?? [:] {
            out[key, default: 0] += value
        }
    }
    return out
}

private func tileSections(for army: Army) -> [(String, [TileDefinition])] {
    let syntheticHq = TileDefinition(
        id: "\(army.id)-hq",
        name: "HQ",
        category: .hq,
        count: 1,
        description: army.hqAbility,
        imageUrl: army.hqImageUrl,
        imageOverlayLabel: nil,
        excludeFromDeck: false,
        displayWithHq: false
    )
    var output: [(String, [TileDefinition])] = []
    if army.multiHeadquarters == true {
        output.append(("Headquarters", army.tiles.filter { $0.category == .hq }))
    } else {
        output.append(("Headquarters", [syntheticHq] + army.tiles.filter { $0.displayWithHq == true }))
    }
    output.append(("Instant Tokens", army.tiles.filter { $0.category == .instant && $0.displayWithHq != true }))
    output.append(("Soldiers", army.tiles.filter { $0.category == .soldier && $0.displayWithHq != true }))
    output.append(("Implants", army.tiles.filter { $0.category == .implant && $0.displayWithHq != true }))
    output.append(("Modules", army.tiles.filter { $0.category == .module && $0.displayWithHq != true }))
    output.append(("Foundations", army.tiles.filter { $0.category == .foundation && $0.displayWithHq != true }))
    return output.filter { !$0.1.isEmpty }
}

private func deckCountsByCategory(_ army: Army) -> [(key: TileCategory, value: Int)] {
    let categories: [TileCategory] = [.instant, .soldier, .implant, .module, .foundation]
    return categories.compactMap { category in
        let count = army.tiles.filter { $0.category == category && $0.excludeFromDeck != true }.reduce(0) { $0 + $1.count }
        return count > 0 ? (category, count) : nil
    }
}

private func categoryDeckLabelKey(_ category: TileCategory) -> String {
    switch category {
    case .hq: return "tileCatHq"
    case .instant: return "homeArmyDeckInstant"
    case .soldier: return "homeArmyDeckSoldier"
    case .implant: return "homeArmyDeckImplant"
    case .foundation: return "homeArmyDeckFoundation"
    case .module: return "homeArmyDeckModule"
    }
}

private func categoryLabelKey(_ category: TileCategory) -> String {
    switch category {
    case .hq: return "tileCatHq"
    case .instant: return "tileCatInstant"
    case .soldier: return "tileCatSoldier"
    case .implant: return "tileCatImplant"
    case .foundation: return "tileCatFoundation"
    case .module: return "tileCatModule"
    }
}

private func tileCategoryIcon(_ category: TileCategory) -> String {
    switch category {
    case .hq: return "🏛"
    case .instant: return "⚡"
    case .soldier: return "⚔"
    case .implant: return "🧬"
    case .foundation: return "🧱"
    case .module: return "⚙"
    }
}

private func tileCategoryOrder(_ category: TileCategory) -> Int {
    switch category {
    case .hq: return 0
    case .instant: return 1
    case .soldier: return 2
    case .implant: return 3
    case .foundation: return 4
    case .module: return 5
    }
}

private func categoryLabel(_ category: TileCategory) -> String {
    switch category {
    case .hq: return "HQ"
    case .instant: return "Instant"
    case .soldier: return "Soldier"
    case .implant: return "Implant"
    case .foundation: return "Foundation"
    case .module: return "Module"
    }
}

private func counterGroups(from instances: [TileInstance], stackIdentical: Bool) -> [TileGroup] {
    guard stackIdentical else {
        return instances.map { TileGroup(tile: $0.tile, instances: [$0]) }
    }
    let grouped = Dictionary(grouping: instances, by: { $0.tile.id })
    return grouped.values.map { TileGroup(tile: $0[0].tile, instances: $0) }.sorted { $0.tile.id < $1.tile.id }
}

private func sortedCounterGroups(from instances: [TileInstance], stackIdentical: Bool) -> [TileGroup] {
    counterGroups(from: instances, stackIdentical: stackIdentical).sorted {
        let lhs = tileCategoryOrder($0.tile.category)
        let rhs = tileCategoryOrder($1.tile.category)
        if lhs != rhs { return lhs < rhs }
        return $0.tile.id < $1.tile.id
    }
}

private func parseColor(_ value: String) -> Color {
    guard let color = UIColor(cssColor: value) else { return .green }
    return Color(color)
}

extension UIColor {
    convenience init?(cssColor: String) {
        let trimmed = cssColor.trimmingCharacters(in: .whitespacesAndNewlines)
        if let rgba = UIColor(rgba: trimmed) {
            self.init(cgColor: rgba.cgColor)
            return
        }
        guard let hex = UIColor(hex: trimmed) else { return nil }
        self.init(cgColor: hex.cgColor)
    }

    private convenience init?(rgba: String) {
        guard rgba.hasPrefix("rgba("), rgba.hasSuffix(")") else { return nil }
        let inner = rgba.dropFirst(5).dropLast()
        let parts = inner.split(separator: ",").map { $0.trimmingCharacters(in: .whitespacesAndNewlines) }
        guard parts.count == 4,
              let red = Double(parts[0]),
              let green = Double(parts[1]),
              let blue = Double(parts[2]),
              let alpha = Double(parts[3]) else { return nil }
        self.init(
            red: red / 255,
            green: green / 255,
            blue: blue / 255,
            alpha: min(max(alpha, 0), 1)
        )
    }

    convenience init?(hex: String) {
        let clean = hex.trimmingCharacters(in: CharacterSet.alphanumerics.inverted)
        guard clean.count == 6, let int = Int(clean, radix: 16) else { return nil }
        self.init(
            red: CGFloat((int >> 16) & 0xff) / 255,
            green: CGFloat((int >> 8) & 0xff) / 255,
            blue: CGFloat(int & 0xff) / 255,
            alpha: 1
        )
    }
}
