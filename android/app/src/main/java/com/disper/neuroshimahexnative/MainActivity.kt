package com.disper.neuroshimahexnative

import android.content.Context
import android.graphics.BitmapFactory
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.BackHandler
import androidx.activity.compose.setContent
import androidx.compose.animation.core.RepeatMode
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.tween
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.ExperimentalLayoutApi
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Button
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Surface
import androidx.compose.material3.Switch
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateListOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.ImageBitmap
import androidx.compose.ui.graphics.asImageBitmap
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardCapitalization
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import org.json.JSONArray
import org.json.JSONObject
import java.util.Locale
import kotlinx.coroutines.delay
import kotlin.random.Random

private const val PREFS_NAME = "nh_native_prefs"
private const val PREF_LOCALE = "locale"

private const val IRON_GANG_ARMY_ID = "iron-gang"
private const val MERCHANTS_GUILD_ARMY_ID = "merchants-guild"
private const val MG_SQUAD_LEADER_TILE_ID = "mg-squad-leader"
private const val CODE_LEN = 6
private const val ALPHABET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ_"
private const val BASE = 32L
private const val SALT_RESPAWN_1 = 0x52e571L
private const val SALT_RESPAWN_2 = 0x52e572L

class MainActivity : ComponentActivity() {
  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    val content = MobileRepository.load(applicationContext)
    setContent {
      MaterialTheme {
        Surface(modifier = Modifier.fillMaxSize(), color = Color(0xFF121212)) {
          NativeMobileApp(content)
        }
      }
    }
  }
}

private enum class LocaleCode { EN, PL }
private enum class FeatureMode { RANDOMIZER, COUNTER, TILEFLIP }
private enum class Screen { HOME, ARMY, SETUP, DRAW, COUNTER }
private enum class TileCategory { HQ, INSTANT, SOLDIER, IMPLANT, FOUNDATION, MODULE }
private enum class FlipPhase { IDLE, ANIMATING, DONE }

private data class TileDefinition(
  val id: String,
  val name: String,
  val category: TileCategory,
  val count: Int,
  val description: String?,
  val imageUrl: String?,
  val imageOverlayLabel: String?,
  val excludeFromDeck: Boolean,
  val displayWithHq: Boolean,
)

private data class Army(
  val id: String,
  val name: String,
  val color: String,
  val accentColor: String,
  val description: String,
  val hqAbility: String,
  val hqImageUrl: String?,
  val multiHeadquarters: Boolean,
  val tiles: List<TileDefinition>,
)

private data class TileInstance(
  val instanceId: String,
  val tile: TileDefinition,
  val armyId: String,
)

private data class DisplayData(
  val armyDisplayNamePl: Map<String, String>,
  val armyDescriptionPl: Map<String, String>,
  val armyHqAbilityPl: Map<String, String>,
  val polishTileNameOverrides: Map<String, String>,
  val enToPlTileNames: Map<String, String>,
)

private data class TileCategoryTheme(
  val cardBorder: String,
  val cardChipBackground: String,
  val cardChipBorder: String,
  val cardChipText: String,
  val badgeBackground: String,
  val badgeText: String,
  val fallbackBackground: String,
)

private data class AppTheme(
  val tileCategories: Map<TileCategory, TileCategoryTheme>,
)

private data class AppContent(
  val armies: List<Army>,
  val uiStrings: Map<LocaleCode, Map<String, String>>,
  val display: DisplayData,
  val theme: AppTheme,
  val version: AppVersion,
)

private class Translator(private val lookup: (String, Map<String, String>) -> String) {
  operator fun invoke(key: String, params: Map<String, String> = emptyMap()): String = lookup(key, params)
}

private data class AppVersion(
  val appVersion: String,
  val appVersionDate: String,
  val appVersionFull: String,
)

private data class HookReplacementSpec(
  val suffix: Char,
  val replacedTileId: String,
  val label: String,
)

private val hookReplacementSpecs = listOf(
  HookReplacementSpec('1', "ig-mountain", "Mountain"),
  HookReplacementSpec('2', "ig-boss", "Boss"),
  HookReplacementSpec('3', "ig-officer", "Officer"),
  HookReplacementSpec('4', "ig-order", "Order"),
  HookReplacementSpec('5', "ig-motorcyclist", "Biker"),
  HookReplacementSpec('6', "ig-double-move", "Doubled Move"),
  HookReplacementSpec('7', "ig-fanatic", "Fanatic"),
  HookReplacementSpec('8', "ig-ranged-netter", "Ranged Net Fighter"),
  HookReplacementSpec('9', "ig-lumberjack", "Lumberjack"),
)

private val wiremenBonusByTileId = mapOf(
  "wiremen-sniper" to mapOf("ini0" to 1),
  "wiremen-castling-ini" to mapOf("iniPlus1" to 1),
  "wiremen-castling-matka" to mapOf("matka" to 1),
  "wiremen-push-cios" to mapOf("meleePlus1" to 1),
  "wiremen-push-matka" to mapOf("matka" to 1),
  "wiremen-push-strzal" to mapOf("rangedPlus1" to 1),
  "wiremen-move-cios" to mapOf("meleePlus1" to 1),
  "wiremen-move-ini" to mapOf("iniPlus1" to 1),
  "wiremen-move-matka" to mapOf("matka" to 1),
  "wiremen-move-strzal" to mapOf("rangedPlus1" to 1),
  "wiremen-battle-cios-ini" to mapOf("iniPlus1" to 1, "meleePlus1" to 1),
  "wiremen-battle-matka-cios" to mapOf("matka" to 1, "meleePlus1" to 1),
  "wiremen-battle-matka-strzal" to mapOf("matka" to 1, "rangedPlus1" to 1),
  "wiremen-battle-strzal-ini" to mapOf("iniPlus1" to 1, "rangedPlus1" to 1),
  "wiremen-battle-zero-ini" to mapOf("iniPlus1" to 1, "ini0" to 1),
)

private object MobileRepository {
  fun load(context: Context): AppContent {
    val armiesJson = JSONArray(readAsset(context, "generated/armies.json"))
    val displayJson = JSONObject(readAsset(context, "generated/display.json"))
    val stringsJson = JSONObject(readAsset(context, "generated/ui-strings.json"))
    val themeJson = JSONObject(readAsset(context, "generated/theme.json"))
    val versionJson = JSONObject(readAsset(context, "generated/version.json"))
    return AppContent(
      armies = parseArmies(armiesJson),
      uiStrings = mapOf(
        LocaleCode.EN to parseStringMap(stringsJson.getJSONObject("en")),
        LocaleCode.PL to parseStringMap(stringsJson.getJSONObject("pl")),
      ),
      display = DisplayData(
        armyDisplayNamePl = parseStringMap(displayJson.getJSONObject("armyDisplayNamePl")),
        armyDescriptionPl = parseStringMap(displayJson.getJSONObject("armyDescriptionPl")),
        armyHqAbilityPl = parseStringMap(displayJson.getJSONObject("armyHqAbilityPl")),
        polishTileNameOverrides = parseStringMap(displayJson.getJSONObject("polishTileNameOverrides")),
        enToPlTileNames = parseStringMap(displayJson.getJSONObject("enToPlTileNames")),
      ),
      theme = AppTheme(
        tileCategories = parseThemeMap(themeJson.getJSONObject("tileCategories"))
      ),
      version = AppVersion(
        appVersion = versionJson.getString("appVersion"),
        appVersionDate = versionJson.getString("appVersionDate"),
        appVersionFull = versionJson.getString("appVersionFull"),
      ),
    )
  }

  private fun parseArmies(array: JSONArray): List<Army> = buildList {
    for (i in 0 until array.length()) {
      val json = array.getJSONObject(i)
      val tiles = json.getJSONArray("tiles")
      add(
        Army(
          id = json.getString("id"),
          name = json.getString("name"),
          color = json.getString("color"),
          accentColor = json.getString("accentColor"),
          description = json.getString("description"),
          hqAbility = json.getString("hqAbility"),
          hqImageUrl = json.optString("hqImageUrl").takeIf { it.isNotBlank() },
          multiHeadquarters = json.optBoolean("multiHeadquarters", false),
          tiles = buildList {
            for (t in 0 until tiles.length()) {
              val tile = tiles.getJSONObject(t)
              add(
                TileDefinition(
                  id = tile.getString("id"),
                  name = tile.getString("name"),
                  category = parseCategory(tile.getString("category")),
                  count = tile.getInt("count"),
                  description = tile.optString("description").takeIf { it.isNotBlank() },
                  imageUrl = tile.optString("imageUrl").takeIf { it.isNotBlank() },
                  imageOverlayLabel = tile.optString("imageOverlayLabel").takeIf { it.isNotBlank() },
                  excludeFromDeck = tile.optBoolean("excludeFromDeck", false),
                  displayWithHq = tile.optBoolean("displayWithHq", false),
                )
              )
            }
          },
        )
      )
    }
  }

  private fun parseCategory(value: String): TileCategory =
    when (value) {
      "hq" -> TileCategory.HQ
      "instant" -> TileCategory.INSTANT
      "soldier" -> TileCategory.SOLDIER
      "implant" -> TileCategory.IMPLANT
      "foundation" -> TileCategory.FOUNDATION
      else -> TileCategory.MODULE
    }

  private fun parseStringMap(json: JSONObject): Map<String, String> =
    buildMap {
      val keys = json.keys()
      while (keys.hasNext()) {
        val key = keys.next()
        put(key, json.getString(key))
      }
    }

  private fun parseThemeMap(json: JSONObject): Map<TileCategory, TileCategoryTheme> =
    buildMap {
      val keys = json.keys()
      while (keys.hasNext()) {
        val key = keys.next()
        val value = json.getJSONObject(key)
        put(
          parseCategory(key),
          TileCategoryTheme(
            cardBorder = value.getString("cardBorder"),
            cardChipBackground = value.getString("cardChipBackground"),
            cardChipBorder = value.getString("cardChipBorder"),
            cardChipText = value.getString("cardChipText"),
            badgeBackground = value.getString("badgeBackground"),
            badgeText = value.getString("badgeText"),
            fallbackBackground = value.getString("fallbackBackground"),
          )
        )
      }
    }

  private fun readAsset(context: Context, name: String): String =
    context.assets.open(name).bufferedReader().use { it.readText() }
}

@Composable
private fun NativeMobileApp(content: AppContent) {
  val context = LocalContext.current
  val prefs = remember { context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE) }
  var locale by rememberSaveable {
    mutableStateOf(
      when (prefs.getString(PREF_LOCALE, null)) {
        "pl" -> LocaleCode.PL
        "en" -> LocaleCode.EN
        else -> if (Locale.getDefault().language.lowercase(Locale.ROOT).startsWith("pl")) LocaleCode.PL else LocaleCode.EN
      }
    )
  }
  var featureMode by rememberSaveable { mutableStateOf(FeatureMode.RANDOMIZER) }
  var screen by rememberSaveable { mutableStateOf(Screen.HOME) }
  var selectedArmyId by rememberSaveable { mutableStateOf<String?>(null) }
  var deckCode by rememberSaveable { mutableStateOf("") }
  var counterAId by rememberSaveable { mutableStateOf<String?>(null) }
  var counterBId by rememberSaveable { mutableStateOf<String?>(null) }

  fun t(key: String, params: Map<String, String> = emptyMap()): String {
    var value = content.uiStrings[locale]?.get(key) ?: content.uiStrings[LocaleCode.EN]?.get(key) ?: key
    params.forEach { (param, replacement) ->
      value = value.replace("{$param}", replacement)
    }
    return value
  }
  val translator = remember(locale, content) { Translator(::t) }

  val armyById = remember(content.armies) { content.armies.associateBy { it.id } }
  val selectedArmy = selectedArmyId?.let(armyById::get)
  val counterA = counterAId?.let(armyById::get)
  val counterB = counterBId?.let(armyById::get)

  fun saveLocale(next: LocaleCode) {
    locale = next
    prefs.edit().putString(PREF_LOCALE, if (next == LocaleCode.PL) "pl" else "en").apply()
  }

  fun goHome() {
    if (featureMode == FeatureMode.TILEFLIP) {
      featureMode = FeatureMode.RANDOMIZER
    }
    screen = Screen.HOME
    selectedArmyId = null
    deckCode = ""
    if (featureMode != FeatureMode.COUNTER) {
      counterAId = null
      counterBId = null
    }
  }

  Surface(color = Color(0xFF121212), modifier = Modifier.fillMaxSize()) {
    Column(modifier = Modifier.fillMaxSize()) {
      AppHeader(
        title = t("brandShort"),
        locale = locale,
        onLocaleChange = ::saveLocale,
        onHome = ::goHome,
      )

      when {
        featureMode == FeatureMode.TILEFLIP && screen == Screen.HOME -> {
          TileFlipScreen(t = translator, onBack = ::goHome)
        }

        screen == Screen.HOME -> {
          HomeScreen(
            armies = content.armies,
            content = content,
            locale = locale,
            featureMode = featureMode,
            counterA = counterA,
            counterB = counterB,
            t = translator,
            onFeatureModeChange = {
              featureMode = it
              screen = Screen.HOME
              selectedArmyId = null
              deckCode = ""
              if (it != FeatureMode.COUNTER) {
                counterAId = null
                counterBId = null
              }
            },
            onArmySelected = { army ->
              if (featureMode == FeatureMode.COUNTER) {
                when {
                  counterAId == null -> counterAId = army.id
                  counterBId == null && counterAId != army.id -> {
                    counterBId = army.id
                    screen = Screen.COUNTER
                  }
                }
              } else {
                selectedArmyId = army.id
                screen = Screen.ARMY
              }
            },
          )
        }

        screen == Screen.ARMY && selectedArmy != null -> {
          ArmyDetailScreen(
            army = selectedArmy,
            content = content,
            locale = locale,
            t = translator,
            onStart = { screen = Screen.SETUP },
          )
        }

        screen == Screen.SETUP && selectedArmy != null -> {
          DeckSetupScreen(
            army = selectedArmy,
            t = translator,
            onBack = { screen = Screen.ARMY },
            onStart = { code ->
              deckCode = code
              screen = Screen.DRAW
            },
          )
        }

        screen == Screen.DRAW && selectedArmy != null -> {
          DrawScreen(
            army = selectedArmy,
            deckCode = deckCode,
            content = content,
            locale = locale,
            t = translator,
            onBack = ::goHome,
            onBackToSetup = { screen = Screen.SETUP },
          )
        }

        screen == Screen.COUNTER && counterA != null && counterB != null -> {
          CounterScreen(
            armyA = counterA,
            armyB = counterB,
            content = content,
            locale = locale,
            t = translator,
            onBack = {
              screen = Screen.HOME
              counterAId = null
              counterBId = null
            },
          )
        }
      }
    }
  }
}

@Composable
private fun AppHeader(
  title: String,
  locale: LocaleCode,
  onLocaleChange: (LocaleCode) -> Unit,
  onHome: () -> Unit,
) {
  Row(
    modifier = Modifier
      .fillMaxWidth()
      .background(Color(0xFF1E1E1E))
      .padding(16.dp),
    horizontalArrangement = Arrangement.SpaceBetween,
    verticalAlignment = Alignment.CenterVertically
  ) {
    Text(
      text = title,
      color = Color.White,
      fontWeight = FontWeight.Bold,
      modifier = Modifier.clickable { onHome() }
    )
    Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
      OutlinedButton(onClick = { onLocaleChange(LocaleCode.EN) }) {
        Text("EN", color = if (locale == LocaleCode.EN) Color.White else Color.LightGray)
      }
      OutlinedButton(onClick = { onLocaleChange(LocaleCode.PL) }) {
        Text("PL", color = if (locale == LocaleCode.PL) Color.White else Color.LightGray)
      }
    }
  }
}

@Composable
private fun HomeScreen(
  armies: List<Army>,
  content: AppContent,
  locale: LocaleCode,
  featureMode: FeatureMode,
  counterA: Army?,
  counterB: Army?,
  t: Translator,
  onFeatureModeChange: (FeatureMode) -> Unit,
  onArmySelected: (Army) -> Unit,
) {
  var query by rememberSaveable { mutableStateOf("") }
  val filtered = remember(armies, query, locale) {
    armies.filter { army ->
      query.isBlank() || armySearchHaystack(army, content.display).contains(query.trim().lowercase(Locale.ROOT))
    }
  }

  if (featureMode == FeatureMode.TILEFLIP) {
    TileFlipScreen(t = t, onBack = { onFeatureModeChange(FeatureMode.RANDOMIZER) })
    return
  }

  Column(
    modifier = Modifier
      .fillMaxSize()
      .verticalScroll(rememberScrollState())
      .padding(16.dp),
    verticalArrangement = Arrangement.spacedBy(12.dp)
  ) {
    Text(t("homeHeroTitle"), color = Color.White, fontSize = 28.sp, fontWeight = FontWeight.Bold)
    Text(t("homeHeroSubtitle"), color = Color(0xFFB0B0B0))
    FeatureModePicker(featureMode = featureMode, t = t, onFeatureModeChange = onFeatureModeChange)

    if (featureMode == FeatureMode.COUNTER) {
      Card(colors = CardDefaults.cardColors(containerColor = Color(0xFF222222))) {
        Column(Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
          Text(t("counterTitle"), color = Color.White, fontWeight = FontWeight.Bold)
          Text(
            when {
              counterA == null -> t("homeCounterStep1")
              counterB == null -> t("homeCounterStep2Prefix") + t("homeCounterStep2Emphasis") + t("homeCounterStep2Suffix")
              else -> armyDisplayName(counterA, locale, content.display) + " vs " + armyDisplayName(counterB, locale, content.display)
            },
            color = Color(0xFFD0D0D0)
          )
        }
      }
    }

    OutlinedTextField(
      value = query,
      onValueChange = { query = it },
      label = { Text(t("homeSearchPlaceholder"), color = Color.LightGray) },
      modifier = Modifier.fillMaxWidth(),
      textStyle = MaterialTheme.typography.bodyLarge.copy(color = Color.White),
    )

    filtered.forEach { army ->
      val counterPickFirst = counterA?.id == army.id
      val counterBlockDuplicate =
        featureMode == FeatureMode.COUNTER &&
          counterA != null &&
          counterB == null &&
          counterA.id == army.id
      ArmyCard(
        army = army,
        content = content,
        locale = locale,
        t = t,
        disabled = counterBlockDuplicate,
        selectedRing = featureMode == FeatureMode.COUNTER && counterPickFirst && counterA != null,
        onClick = { onArmySelected(army) },
      )
    }

    Card(colors = CardDefaults.cardColors(containerColor = Color(0xFF1A1A1A))) {
      Column(Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(6.dp)) {
        Text("About", color = Color.White, fontWeight = FontWeight.Bold)
        Text("Native preview powered by generated shared content.", color = Color(0xFFD0D0D0))
        Text("Web source version: ${content.version.appVersionFull}", color = Color(0xFF9E9E9E))
      }
    }
  }
}

@Composable
private fun FeatureModePicker(
  featureMode: FeatureMode,
  t: Translator,
  onFeatureModeChange: (FeatureMode) -> Unit,
) {
  Row(horizontalArrangement = Arrangement.spacedBy(8.dp), modifier = Modifier.fillMaxWidth()) {
    listOf(
      FeatureMode.RANDOMIZER to "homeFeatureRandomizer",
      FeatureMode.COUNTER to "homeFeatureCounter",
      FeatureMode.TILEFLIP to "homeFeatureTileflip"
    ).forEach { (mode, labelKey) ->
      val selected = mode == featureMode
      val background = if (selected) Color(0xFF6E8B3D) else Color(0xFF2A2A2A)
      Text(
        text = t(labelKey),
        color = Color.White,
        modifier = Modifier
          .weight(1f)
          .background(background, RoundedCornerShape(12.dp))
          .clickable { onFeatureModeChange(mode) }
          .padding(horizontal = 12.dp, vertical = 14.dp)
      )
    }
  }
}

@Composable
private fun ArmyCard(
  army: Army,
  content: AppContent,
  locale: LocaleCode,
  t: Translator,
  disabled: Boolean = false,
  selectedRing: Boolean = false,
  onClick: () -> Unit,
) {
  val image = rememberAssetImage(assetPath(army.hqImageUrl))
  Card(
    modifier = Modifier
      .fillMaxWidth()
      .then(
        if (selectedRing) {
          Modifier.border(2.dp, Color(0xB3FFB300), RoundedCornerShape(16.dp))
        } else {
          Modifier
        }
      ),
    colors = CardDefaults.cardColors(containerColor = Color(0xFF1F1F1F)),
    onClick = {
      if (!disabled) onClick()
    }
  ) {
    Column(
      Modifier
        .padding(16.dp)
        .then(if (disabled) Modifier.graphicsLayer(alpha = 0.4f) else Modifier),
      verticalArrangement = Arrangement.spacedBy(8.dp)
    ) {
      if (image != null) {
        Image(
          bitmap = image,
          contentDescription = armyDisplayName(army, locale, content.display),
          modifier = Modifier.size(96.dp)
        )
      }
      Text(
        armyDisplayName(army, locale, content.display),
        color = parseColor(army.accentColor),
        fontWeight = FontWeight.Bold,
        fontSize = 20.sp
      )
      Text(armyDescription(army, locale, content.display), color = Color(0xFFD0D0D0), maxLines = 3)
      Row(
        horizontalArrangement = Arrangement.spacedBy(6.dp),
        modifier = Modifier.horizontalScroll(rememberScrollState())
      ) {
        deckCountsByCategory(army).forEach { (category, count) ->
          val categoryTheme = content.theme.tileCategories[category] ?: return@forEach
          Text(
            text = t(categoryDeckLabelKey(category), mapOf("n" to count.toString())),
            color = parseColor(categoryTheme.cardChipText),
            maxLines = 1,
            softWrap = false,
            modifier = Modifier
              .border(
                width = 1.dp,
                color = parseColor(categoryTheme.cardChipBorder),
                shape = RoundedCornerShape(999.dp)
              )
              .background(parseColor(categoryTheme.cardChipBackground), RoundedCornerShape(999.dp))
              .padding(horizontal = 10.dp, vertical = 6.dp)
          )
        }
      }
    }
  }
}

@Composable
private fun ArmyDetailScreen(
  army: Army,
  content: AppContent,
  locale: LocaleCode,
  t: Translator,
  onStart: () -> Unit,
) {
  Column(
    modifier = Modifier
      .fillMaxSize()
      .verticalScroll(rememberScrollState())
      .padding(16.dp),
    verticalArrangement = Arrangement.spacedBy(12.dp)
  ) {
    Text(armyDisplayName(army, locale, content.display), color = parseColor(army.accentColor), fontSize = 30.sp, fontWeight = FontWeight.Bold)
    Text(armyDescription(army, locale, content.display), color = Color(0xFFD0D0D0))
    Card(colors = CardDefaults.cardColors(containerColor = Color(0xFF25201A))) {
      Column(Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
        Text(t("armyHqSpecial"), color = Color(0xFFFFC107), fontWeight = FontWeight.SemiBold)
        Text(armyHqAbility(army, locale, content.display), color = Color.White)
      }
    }
    Button(onClick = onStart, modifier = Modifier.fillMaxWidth()) {
      Text(t("armyStartDraw"))
    }
    tileSections(army).forEach { section ->
      Text(section.first, color = Color.White, fontWeight = FontWeight.Bold, fontSize = 18.sp)
      Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
        section.second.forEach { tile ->
          TileRow(
            tile = tile,
            title = tileDisplayName(tile, locale, content.display),
            subtitle = tile.description,
          )
        }
      }
    }
  }
}

@Composable
private fun DeckSetupScreen(
  army: Army,
  t: Translator,
  onBack: () -> Unit,
  onStart: (String) -> Unit,
) {
  val context = LocalContext.current
  val clipboard = remember(context) {
    context.getSystemService(Context.CLIPBOARD_SERVICE) as android.content.ClipboardManager
  }
  val isIronGang = army.id == IRON_GANG_ARMY_ID
  val codeLen = if (isIronGang) 7 else 6
  var mode by rememberSaveable(army.id) { mutableStateOf("new") }
  var code by rememberSaveable(army.id) {
    mutableStateOf(if (isIronGang) generateIronGangDeckCode() else generateCode())
  }
  var input by rememberSaveable(army.id) { mutableStateOf("") }
  var error by rememberSaveable(army.id) { mutableStateOf("") }

  Column(
    modifier = Modifier
      .fillMaxSize()
      .padding(16.dp),
    verticalArrangement = Arrangement.spacedBy(12.dp)
  ) {
    OutlinedButton(onClick = onBack) { Text(t("deckBack")) }
    Text(t("deckTitle"), color = Color.White, fontSize = 28.sp, fontWeight = FontWeight.Bold)
    Text(if (isIronGang) t("deckBlurbIronGang") else t("deckBlurbStandard"), color = Color(0xFFD0D0D0))
    FeatureModeRow(
      options = listOf("new" to t("deckModeNew"), "join" to t("deckModeJoin")),
      selected = mode,
      onSelected = {
        mode = it
        error = ""
      }
    )
    if (mode == "new") {
      CodeChipRow(code = code)
      Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
        OutlinedButton(onClick = { code = if (isIronGang) generateIronGangDeckCode() else generateCode() }) {
          Text(t("deckRegenerate"))
        }
        OutlinedButton(onClick = {
          clipboard.setPrimaryClip(android.content.ClipData.newPlainText("deck-code", code))
        }) {
          Text(t("deckCopy"))
        }
      }
    } else {
      OutlinedTextField(
        value = input,
        onValueChange = {
          val allowed = if (isIronGang) "0123456789ABCDEFGHJKMNPQRSTUVWXYZ_" else ALPHABET
          input = it.uppercase(Locale.ROOT).filter { char -> allowed.contains(char) }.take(codeLen)
          error = ""
        },
        label = { Text(t("deckEnterCode")) },
        modifier = Modifier.fillMaxWidth(),
        keyboardOptions = KeyboardOptions(capitalization = KeyboardCapitalization.Characters),
        textStyle = MaterialTheme.typography.bodyLarge.copy(color = Color.White),
      )
      if (error.isNotBlank()) {
        Text(error, color = Color(0xFFFF8080))
      }
    }
    Button(
      onClick = {
        if (mode == "new") {
          onStart(code)
        } else {
          val entered = input
          when {
            entered.length != codeLen -> error = t("deckErrorCodeLength", mapOf("len" to codeLen.toString()))
            isIronGang && parseIronGangDeckCode(entered) == null -> error = t("deckErrorInvalid")
            !isIronGang && codeToSeed(entered) == null -> error = t("deckErrorInvalid")
            else -> onStart(entered)
          }
        }
      },
      modifier = Modifier.fillMaxWidth()
    ) {
      Text(t("deckStartDrawing"))
    }
  }
}

@OptIn(ExperimentalLayoutApi::class)
@Composable
private fun DrawScreen(
  army: Army,
  deckCode: String,
  content: AppContent,
  locale: LocaleCode,
  t: Translator,
  onBack: () -> Unit,
  onBackToSetup: () -> Unit,
) {
  val context = LocalContext.current
  val clipboard = remember(context) {
    context.getSystemService(Context.CLIPBOARD_SERVICE) as android.content.ClipboardManager
  }
  val drawKey = remember(army.id, deckCode) { "${army.id}:$deckCode" }
  var deck by remember(drawKey) { mutableStateOf(buildShuffledDeck(army, deckCode)) }
  var drawIndex by remember(drawKey) { mutableIntStateOf(0) }
  var mgRecon1Shuffled by remember(drawKey) { mutableStateOf(false) }
  var mgRecon2Shuffled by remember(drawKey) { mutableStateOf(false) }

  val drawn = deck.take(drawIndex)
  val remaining = deck.drop(drawIndex)
  val lastDrawn = drawn.lastOrNull()

  Column(
    modifier = Modifier
      .fillMaxSize()
      .verticalScroll(rememberScrollState())
      .padding(16.dp),
    verticalArrangement = Arrangement.spacedBy(12.dp)
  ) {
    Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
      OutlinedButton(onClick = onBack) { Text(t("drawBack")) }
      OutlinedButton(onClick = {
        deck = buildShuffledDeck(army, deckCode)
        drawIndex = 0
        mgRecon1Shuffled = false
        mgRecon2Shuffled = false
      }) { Text(t("drawReset")) }
    }
    if (army.id == MERCHANTS_GUILD_ARMY_ID) {
      Text(t("drawMgBanner"), color = Color(0xFFD0D0D0))
    }
    if (army.id == IRON_GANG_ARMY_ID) {
      val mode = parseIronGangDeckCode(deckCode)
      if (mode != null) {
        Text(ironGangBanner(mode, army, locale, content.display), color = Color(0xFFD0D0D0))
      }
    }
    CodeChipRow(code = deckCode)
    Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
      OutlinedButton(onClick = {
        clipboard.setPrimaryClip(android.content.ClipData.newPlainText("deck-code", deckCode))
      }) { Text(t("drawCopy")) }
      OutlinedButton(onClick = onBackToSetup) { Text(t("drawChangeCode")) }
    }
    Text(t("drawLeft", mapOf("n" to remaining.size.toString(), "total" to deck.size.toString())), color = Color.White)
    Button(
      onClick = { if (drawIndex < deck.size) drawIndex += 1 },
      modifier = Modifier.fillMaxWidth(),
      enabled = drawIndex < deck.size
    ) {
      Text(if (drawIndex == 0) t("drawFirstTile") else t("drawTileLeft", mapOf("n" to (deck.size - drawIndex).toString())))
    }
    if (army.id == MERCHANTS_GUILD_ARMY_ID) {
      val squadLeadersDrawn = drawn.count { it.tile.id == MG_SQUAD_LEADER_TILE_ID }
      if (squadLeadersDrawn >= 1 && !mgRecon1Shuffled) {
        OutlinedButton(onClick = {
          deck = insertMerchantsGuildReconnaissance(deck, drawIndex, 1, army.id, codeToSeed(deckCode), army.tiles.firstOrNull { it.id == MG_SQUAD_LEADER_TILE_ID }?.imageUrl)
          mgRecon1Shuffled = true
        }) { Text(t("drawShuffleRecon1")) }
      }
      if (squadLeadersDrawn >= 2 && !mgRecon2Shuffled) {
        OutlinedButton(onClick = {
          deck = insertMerchantsGuildReconnaissance(deck, drawIndex, 2, army.id, codeToSeed(deckCode), army.tiles.firstOrNull { it.id == MG_SQUAD_LEADER_TILE_ID }?.imageUrl)
          mgRecon2Shuffled = true
        }) { Text(t("drawShuffleRecon2")) }
      }
    }
    lastDrawn?.let {
      Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
        Text(
          t("drawLastDrawn", mapOf("i" to drawIndex.toString(), "total" to deck.size.toString())),
          color = Color(0xFF9E9E9E),
          fontSize = 12.sp,
          fontWeight = FontWeight.SemiBold
        )
        NativeTileCard(
          tile = it.tile,
          title = tileDisplayName(it.tile, locale, content.display),
          content = content,
          t = t,
          count = 1,
          spotlight = true
        )
      }
    }
    Text(t("drawDrawnSection", mapOf("n" to drawn.size.toString())), color = Color.White, fontWeight = FontWeight.Bold)
    FlowRow(
      horizontalArrangement = Arrangement.spacedBy(8.dp),
      verticalArrangement = Arrangement.spacedBy(8.dp),
      maxItemsInEachRow = 3
    ) {
      drawn.reversed().forEachIndexed { idx, entry ->
        NativeTileCard(
          tile = entry.tile,
          title = tileDisplayName(entry.tile, locale, content.display),
          content = content,
          t = t,
          count = 1,
          small = true,
          dimmed = idx > 0
        )
      }
    }
  }
}

@Composable
private fun CounterScreen(
  armyA: Army,
  armyB: Army,
  content: AppContent,
  locale: LocaleCode,
  t: Translator,
  onBack: () -> Unit,
) {
  var resetVersion by remember { mutableIntStateOf(0) }
  var stackIdentical by rememberSaveable { mutableStateOf(true) }

  Column(
    modifier = Modifier
      .fillMaxSize()
      .verticalScroll(rememberScrollState())
      .padding(16.dp),
    verticalArrangement = Arrangement.spacedBy(12.dp)
  ) {
    Row(horizontalArrangement = Arrangement.spacedBy(8.dp), verticalAlignment = Alignment.CenterVertically) {
      OutlinedButton(onClick = onBack) { Text(t("counterBackArmies")) }
      OutlinedButton(onClick = { resetVersion += 1 }) { Text(t("counterResetBoth")) }
    }
    Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
      Text(t("counterStackIdentical"), color = Color.White)
      Switch(checked = stackIdentical, onCheckedChange = { stackIdentical = it })
    }
    CounterArmyPane(armyA, content, locale, t, stackIdentical, resetVersion)
    CounterArmyPane(armyB, content, locale, t, stackIdentical, resetVersion)
  }
}

@OptIn(ExperimentalLayoutApi::class)
@Composable
private fun CounterArmyPane(
  army: Army,
  content: AppContent,
  locale: LocaleCode,
  t: Translator,
  stackIdentical: Boolean,
  resetVersion: Int,
) {
  val remaining = remember(army.id, resetVersion) { mutableStateListOf<TileInstance>().apply { addAll(buildDeck(army)) } }
  val drawn = remember(army.id, resetVersion) { mutableStateListOf<TileInstance>() }

  LaunchedEffect(resetVersion) {
    remaining.clear()
    remaining.addAll(buildDeck(army))
    drawn.clear()
  }

  val remainingBonuses = if (army.id == "wiremen") wiremenTechBonusesRemaining(remaining) else emptyMap()

  Card(colors = CardDefaults.cardColors(containerColor = Color(0xFF1F1F1F))) {
    Column(Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
      Text(armyDisplayName(army, locale, content.display), color = parseColor(army.accentColor), fontWeight = FontWeight.Bold, fontSize = 22.sp)
      Text(t("counterDrawnOfTotal", mapOf("drawn" to drawn.size.toString(), "total" to (drawn.size + remaining.size).toString())), color = Color(0xFFD0D0D0))
      if (army.id == "wiremen") {
      Column(verticalArrangement = Arrangement.spacedBy(6.dp)) {
          remainingBonuses.forEach { (key, value) ->
            Text(
              "$key: $value",
              color = Color.White,
              modifier = Modifier.background(Color(0xFF124C4C), RoundedCornerShape(999.dp)).padding(horizontal = 10.dp, vertical = 6.dp)
            )
          }
        }
      }
      Text(t("counterRemaining", mapOf("n" to remaining.size.toString())), color = Color.White, fontWeight = FontWeight.SemiBold)
      FlowRow(
        horizontalArrangement = Arrangement.spacedBy(8.dp),
        verticalArrangement = Arrangement.spacedBy(8.dp),
        maxItemsInEachRow = 3
      ) {
        sortTileGroupsByCategory(
          if (stackIdentical) groupInstances(remaining) else remaining.map { it.tile to listOf(it) }
        ).forEach { (tile, instances) ->
          NativeTileCard(
            tile = tile,
            title = tileDisplayName(tile, locale, content.display),
            content = content,
            t = t,
            count = instances.size,
            countInParentheses = stackIdentical && instances.size > 1,
            small = true,
            onClick = {
              val instance = instances.firstOrNull() ?: return@NativeTileCard
              remaining.remove(instance)
              drawn.add(instance)
            }
          )
        }
      }
      Text(t("counterDrawn", mapOf("n" to drawn.size.toString())), color = Color.White, fontWeight = FontWeight.SemiBold)
      FlowRow(
        horizontalArrangement = Arrangement.spacedBy(8.dp),
        verticalArrangement = Arrangement.spacedBy(8.dp),
        maxItemsInEachRow = 3
      ) {
        sortTileGroupsByCategory(
          if (stackIdentical) groupInstances(drawn) else drawn.map { it.tile to listOf(it) }
        ).forEach { (tile, instances) ->
          NativeTileCard(
            tile = tile,
            title = tileDisplayName(tile, locale, content.display),
            content = content,
            t = t,
            count = instances.size,
            countInParentheses = stackIdentical && instances.size > 1,
            small = true,
            drawnOverlay = true,
            onClick = {
              val instance = instances.lastOrNull() ?: return@NativeTileCard
              drawn.remove(instance)
              remaining.add(0, instance)
            }
          )
        }
      }
    }
  }
}

@Composable
private fun CounterTileList(
  items: List<Pair<TileDefinition, List<TileInstance>>>,
  titleFor: (TileDefinition) -> String,
  onTap: (List<TileInstance>) -> Unit,
) {
  Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
    items.forEach { (tile, instances) ->
      val image = rememberAssetImage(assetPath(tile.imageUrl))
      Row(
        modifier = Modifier
          .fillMaxWidth()
          .background(Color(0xFF2B2B2B), RoundedCornerShape(12.dp))
          .clickable { onTap(instances) }
          .padding(12.dp),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
      ) {
        Row(horizontalArrangement = Arrangement.spacedBy(10.dp), verticalAlignment = Alignment.CenterVertically) {
          if (image != null) {
            Image(bitmap = image, contentDescription = titleFor(tile), modifier = Modifier.size(40.dp))
          }
          Text(titleFor(tile), color = Color.White)
        }
        Text(instances.size.toString(), color = Color(0xFFD0D0D0))
      }
    }
  }
}

@Composable
private fun TileFlipScreen(t: Translator, onBack: () -> Unit) {
  BackHandler(onBack = onBack)
  var phase by rememberSaveable { mutableStateOf(FlipPhase.IDLE) }
  var result by rememberSaveable { mutableStateOf<String?>(null) }
  var pendingWinner by rememberSaveable { mutableStateOf<String?>(null) }
  val vultureImage = rememberAssetImage("images/beasts/bestie-sep.png")
  val tailsImage = rememberAssetImage("images/beasts/bestie-sztab.png")
  val transition = rememberInfiniteTransition(label = "tile-flip")
  val waveA by transition.animateFloat(
    initialValue = 0f,
    targetValue = 1f,
    animationSpec = infiniteRepeatable(animation = tween(900), repeatMode = RepeatMode.Restart),
    label = "wave-a"
  )
  val waveB by transition.animateFloat(
    initialValue = 0f,
    targetValue = 1f,
    animationSpec = infiniteRepeatable(animation = tween(980), repeatMode = RepeatMode.Restart),
    label = "wave-b"
  )

  LaunchedEffect(phase, pendingWinner) {
    if (phase == FlipPhase.ANIMATING && pendingWinner != null) {
      delay(3000)
      result = pendingWinner
      phase = FlipPhase.DONE
    }
  }

  val vultureTransform = when (phase) {
    FlipPhase.ANIMATING -> TileFlipTransform(
      dx = kotlin.math.sin(waveA * 6.28318f * 2.1f) * 6f,
      dy = kotlin.math.cos(waveA * 6.28318f * 1.85f) * 4.5f,
      rotation = kotlin.math.sin(waveA * 6.28318f * 2.4f) * 2.5f,
      scale = 1f
    )
    FlipPhase.DONE -> TileFlipTransform(
      dx = 0f,
      dy = 0f,
      rotation = 0f,
      scale = if (result == t("flipVulture")) 1.2f else 0.78f
    )
    else -> TileFlipTransform()
  }
  val tailsTransform = when (phase) {
    FlipPhase.ANIMATING -> TileFlipTransform(
      dx = kotlin.math.sin(waveB * 6.28318f * 1.95f + 1.1f) * 6f,
      dy = kotlin.math.cos(waveB * 6.28318f * 2.05f + 0.7f) * 4.5f,
      rotation = kotlin.math.sin(waveB * 6.28318f * 2.35f + 0.9f) * 2.5f,
      scale = 1f
    )
    FlipPhase.DONE -> TileFlipTransform(
      dx = 0f,
      dy = 0f,
      rotation = 0f,
      scale = if (result == t("flipTails")) 1.2f else 0.78f
    )
    else -> TileFlipTransform()
  }
  Column(
    modifier = Modifier
      .fillMaxSize()
      .padding(24.dp),
    horizontalAlignment = Alignment.CenterHorizontally,
    verticalArrangement = Arrangement.Center
  ) {
    OutlinedButton(onClick = onBack) { Text(t("counterBackArmies")) }
    Spacer(Modifier.height(12.dp))
    Text(t("flipTitle"), color = Color.White, fontSize = 28.sp, fontWeight = FontWeight.Bold)
    Spacer(Modifier.height(12.dp))
    Text(t("flipSubtitle"), color = Color(0xFFD0D0D0))
    Spacer(Modifier.height(24.dp))
    Row(horizontalArrangement = Arrangement.spacedBy(16.dp), verticalAlignment = Alignment.CenterVertically) {
      TileFlipChoice(
        image = vultureImage,
        label = t("flipVulture"),
        highlighted = phase == FlipPhase.DONE && result == t("flipVulture"),
        dimmed = phase == FlipPhase.DONE && result == t("flipTails"),
        transform = vultureTransform
      )
      TileFlipChoice(
        image = tailsImage,
        label = t("flipTails"),
        highlighted = phase == FlipPhase.DONE && result == t("flipTails"),
        dimmed = phase == FlipPhase.DONE && result == t("flipVulture"),
        transform = tailsTransform
      )
    }
    Spacer(Modifier.height(24.dp))
    Button(
      onClick = {
        pendingWinner = if (Random.nextBoolean()) t("flipVulture") else t("flipTails")
        result = null
        phase = FlipPhase.ANIMATING
      },
      enabled = phase != FlipPhase.ANIMATING
    ) {
      Text(
        when (phase) {
          FlipPhase.ANIMATING -> t("flipAnimating")
          FlipPhase.DONE -> t("flipAgain")
          FlipPhase.IDLE -> t("flipButton")
        }
      )
    }
    if (phase == FlipPhase.DONE && result != null) {
      Spacer(Modifier.height(12.dp))
      Text("${t("flipResult")} $result", color = Color.White, fontWeight = FontWeight.Bold)
    }
  }
}

private data class TileFlipTransform(
  val dx: Float = 0f,
  val dy: Float = 0f,
  val rotation: Float = 0f,
  val scale: Float = 1f,
)

@Composable
private fun TileFlipChoice(
  image: ImageBitmap?,
  label: String,
  highlighted: Boolean,
  dimmed: Boolean,
  transform: TileFlipTransform,
) {
  Column(horizontalAlignment = Alignment.CenterHorizontally, verticalArrangement = Arrangement.spacedBy(8.dp)) {
    Box(
      modifier = Modifier
        .graphicsLayer {
          translationX = transform.dx
          translationY = transform.dy
          rotationZ = transform.rotation
          scaleX = transform.scale
          scaleY = transform.scale
          alpha = if (dimmed) 0.7f else 1f
        }
        .background(if (highlighted) Color(0xFF355E3B) else Color(0xFF232323), RoundedCornerShape(16.dp))
        .padding(12.dp),
      contentAlignment = Alignment.Center
    ) {
      if (image != null) {
        Image(bitmap = image, contentDescription = label, modifier = Modifier.size(140.dp))
      } else {
        Text(label.take(1), color = Color.White)
      }
    }
    Text(label, color = Color.White)
  }
}

@Composable
private fun NativeTileCard(
  tile: TileDefinition,
  title: String,
  content: AppContent,
  t: Translator,
  count: Int = tile.count,
  countInParentheses: Boolean = false,
  small: Boolean = false,
  spotlight: Boolean = false,
  drawnOverlay: Boolean = false,
  dimmed: Boolean = false,
  onClick: (() -> Unit)? = null,
) {
  val image = rememberAssetImage(assetPath(tile.imageUrl))
  val theme = content.theme.tileCategories[tile.category]
  val shape = RoundedCornerShape(14.dp)
  val displayTitle = if (countInParentheses && count > 1) "$title ($count)" else title
  val borderColor = theme?.let { parseColor(it.cardBorder) } ?: Color(0xFF4A4A4A)
  val badgeBackground = theme?.let { parseColor(it.badgeBackground) } ?: Color(0xFF6E8B3D)
  val badgeText = theme?.let { parseColor(it.badgeText) } ?: Color.Black
  val fallbackBackground = theme?.let { parseColor(it.fallbackBackground) } ?: Color(0xFF2B2B2B)
  val imageHeight = when {
    spotlight -> 176.dp
    small -> 80.dp
    else -> 128.dp
  }
  val cardWidth = when {
    spotlight -> 156.dp
    small -> 124.dp
    else -> 144.dp
  }

  Box(
    modifier = Modifier
      .width(cardWidth)
      .graphicsLayer {
        alpha = if (dimmed) 0.3f else 1f
        scaleX = if (dimmed) 0.95f else 1f
        scaleY = if (dimmed) 0.95f else 1f
      }
  ) {
    Column(
      modifier = Modifier
        .fillMaxWidth()
        .border(1.dp, borderColor, shape)
        .background(Color(0xFF1C1917), shape)
        .then(if (onClick != null) Modifier.clickable { onClick() } else Modifier)
    ) {
      Box(
        modifier = Modifier
          .fillMaxWidth()
          .padding(if (small) 4.dp else 8.dp)
          .height(imageHeight)
          .background(if (image == null) fallbackBackground else Color.Transparent, RoundedCornerShape(10.dp)),
        contentAlignment = Alignment.Center
      ) {
        if (image != null) {
          if (!tile.imageOverlayLabel.isNullOrBlank()) {
            Box(
              modifier = Modifier
                .fillMaxSize()
                .background(Color.Black, RoundedCornerShape(10.dp)),
              contentAlignment = Alignment.Center
            ) {
              Image(
                bitmap = image,
                contentDescription = title,
                modifier = Modifier
                  .fillMaxSize()
                  .graphicsLayer(alpha = 0.22f)
              )
              Box(
                modifier = Modifier
                  .matchParentSize()
                  .background(Color(0xA6000000), RoundedCornerShape(10.dp))
              )
              Text(
                text = tile.imageOverlayLabel,
                color = Color.White,
                fontWeight = FontWeight.Black,
                fontSize = if (spotlight) 34.sp else if (small) 16.sp else 24.sp
              )
            }
          } else {
            Image(bitmap = image, contentDescription = title, modifier = Modifier.fillMaxSize())
          }
        } else {
          Text(
            text = tileCategoryIcon(tile.category),
            color = Color(0xFFB0B0B0),
            fontSize = if (spotlight) 42.sp else if (small) 28.sp else 38.sp
          )
        }
      }

      Row(
        modifier = Modifier
          .fillMaxWidth()
          .background(Color(0x99111111))
          .padding(horizontal = 8.dp, vertical = 6.dp),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
      ) {
        Text(
          text = displayTitle,
          color = Color.White,
          fontWeight = FontWeight.SemiBold,
          fontSize = if (small) 12.sp else 14.sp,
          maxLines = 1,
          overflow = TextOverflow.Ellipsis,
          modifier = Modifier.weight(1f, fill = false)
        )
        if (!countInParentheses && count > 1) {
          Spacer(Modifier.width(6.dp))
          Text(
            text = "×$count",
            color = badgeText,
            fontWeight = FontWeight.Bold,
            fontSize = 11.sp,
            modifier = Modifier
              .background(badgeBackground, RoundedCornerShape(999.dp))
              .padding(horizontal = 6.dp, vertical = 2.dp)
          )
        }
      }

      if (!small) {
        Text(
          text = t(categoryLabelKey(tile.category)),
          color = badgeText,
          fontSize = 11.sp,
          fontWeight = FontWeight.Medium,
          modifier = Modifier
            .padding(start = 8.dp, end = 8.dp, bottom = 8.dp)
            .background(badgeBackground, RoundedCornerShape(6.dp))
            .padding(horizontal = 6.dp, vertical = 3.dp)
        )
      }
    }

    if (drawnOverlay) {
      Box(
        modifier = Modifier
          .matchParentSize()
          .background(Color(0x19FF4D4D), shape)
          .border(1.dp, Color(0x33FF6B6B), shape)
      )
    }
  }
}

@Composable
private fun TileRow(tile: TileDefinition, title: String, subtitle: String?) {
  val image = rememberAssetImage(assetPath(tile.imageUrl))
  Row(
    modifier = Modifier
      .fillMaxWidth()
      .background(Color(0xFF232323), RoundedCornerShape(14.dp))
      .padding(12.dp),
    horizontalArrangement = Arrangement.spacedBy(12.dp),
    verticalAlignment = Alignment.CenterVertically
  ) {
    if (image != null) {
      Image(bitmap = image, contentDescription = title, modifier = Modifier.size(72.dp))
    } else {
      Box(
        modifier = Modifier.size(72.dp).background(Color(0xFF444444), RoundedCornerShape(12.dp)),
        contentAlignment = Alignment.Center
      ) {
        Text(title.take(1), color = Color.White)
      }
    }
    Column(verticalArrangement = Arrangement.spacedBy(4.dp)) {
      Text(title, color = Color.White, fontWeight = FontWeight.SemiBold)
      subtitle?.let { Text(it, color = Color(0xFFD0D0D0), fontSize = 13.sp) }
    }
  }
}

@Composable
private fun CodeChipRow(code: String) {
  Row(horizontalArrangement = Arrangement.spacedBy(8.dp), modifier = Modifier.fillMaxWidth()) {
    code.forEach { char ->
      Box(
        modifier = Modifier
          .background(Color(0xFF2C2C2C), RoundedCornerShape(12.dp))
          .padding(horizontal = 12.dp, vertical = 14.dp)
      ) {
        Text(char.toString(), color = Color.White, fontWeight = FontWeight.Bold)
      }
    }
  }
}

@Composable
private fun FeatureModeRow(options: List<Pair<String, String>>, selected: String, onSelected: (String) -> Unit) {
  Row(horizontalArrangement = Arrangement.spacedBy(8.dp), modifier = Modifier.fillMaxWidth()) {
    options.forEach { (value, label) ->
      val background = if (value == selected) Color(0xFF6E8B3D) else Color(0xFF2B2B2B)
      Text(
        text = label,
        color = Color.White,
        modifier = Modifier
          .weight(1f)
          .background(background, RoundedCornerShape(12.dp))
          .clickable { onSelected(value) }
          .padding(horizontal = 12.dp, vertical = 14.dp)
      )
    }
  }
}

@Composable
private fun rememberAssetImage(assetPath: String?): ImageBitmap? {
  val context = LocalContext.current
  return remember(assetPath) {
    if (assetPath == null) {
      null
    } else {
      runCatching {
        context.assets.open(assetPath).use { BitmapFactory.decodeStream(it)?.asImageBitmap() }
      }.getOrNull()
    }
  }
}

private fun assetPath(value: String?): String? =
  value?.removePrefix("src/assets/")?.let { "images/$it" }

private fun buildDeck(army: Army): List<TileInstance> =
  buildList {
    for (tile in army.tiles) {
      if (tile.excludeFromDeck) continue
      repeat(tile.count) { index ->
        add(TileInstance("${tile.id}-$index", tile, army.id))
      }
    }
  }

private fun buildShuffledDeck(army: Army, deckCode: String): MutableList<TileInstance> {
  var base = buildDeck(army)
  if (army.id == IRON_GANG_ARMY_ID) {
    parseIronGangDeckCode(deckCode)?.let { mode ->
      base = applyIronGangHookMode(base, mode)
    }
  }
  val seed = codeToSeed(deckCode)
  return if (seed == null) base.toMutableList() else seededShuffle(base, seed).toMutableList()
}

private fun generateCode(): String = seedToCode(Random.nextInt().toLong() and 0xffffffffL)

private fun generateIronGangDeckCode(): String {
  val suffixes = listOf('0') + hookReplacementSpecs.map { it.suffix }
  return seedToCode(Random.nextInt().toLong() and 0xffffffffL) + suffixes.random()
}

private fun seedToCode(seed: Long): String {
  var n = seed
  var code = ""
  repeat(CODE_LEN) {
    code = ALPHABET[(n % BASE).toInt()] + code
    n /= BASE
  }
  return code
}

private fun codeToSeed(code: String): Long? {
  val normalized = code.uppercase(Locale.ROOT).trim()
  if (normalized.length < CODE_LEN) return null
  var n = 0L
  normalized.take(CODE_LEN).forEach { char ->
    val idx = ALPHABET.indexOf(char)
    if (idx < 0) return null
    n = n * BASE + idx.toLong()
  }
  return n
}

private fun imul32(a: Int, b: Int): Long = (a.toLong() * b.toLong()).toInt().toLong() and 0xffffffffL

private fun mulberry32(seed: Long): () -> Double {
  var s = seed and 0xffffffffL
  return {
    s = (s + 0x6d2b79f5L) and 0xffffffffL
    var t = imul32((s xor (s ushr 15)).toInt(), (1L or s).toInt())
    t = (t + imul32((t xor (t ushr 7)).toInt(), (61L or t).toInt())) xor t
    ((t xor (t ushr 14)) and 0xffffffffL) / 4294967296.0
  }
}

private fun <T> seededShuffle(input: List<T>, seed: Long): List<T> {
  val copy = input.toMutableList()
  val rand = mulberry32(seed)
  for (i in copy.lastIndex downTo 1) {
    val j = (rand() * (i + 1)).toInt()
    val swap = copy[i]
    copy[i] = copy[j]
    copy[j] = swap
  }
  return copy
}

private fun parseIronGangDeckCode(code: String): String? {
  val normalized = code.uppercase(Locale.ROOT).trim()
  if (normalized.length != 7) return null
  if (codeToSeed(normalized) == null) return null
  val suffix = normalized[6]
  if (suffix == '0') return "no-hook"
  val spec = hookReplacementSpecs.find { it.suffix == suffix } ?: return null
  return "replace:${spec.replacedTileId}"
}

private fun applyIronGangHookMode(deck: List<TileInstance>, mode: String): List<TileInstance> {
  if (mode == "no-hook") return deck.filter { it.tile.id != "ig-hook" }
  val replacedTileId = mode.removePrefix("replace:")
  val idx = deck.indexOfFirst { it.tile.id == replacedTileId }
  return if (idx < 0) deck else deck.toMutableList().also { it.removeAt(idx) }
}

private fun insertMerchantsGuildReconnaissance(
  deck: List<TileInstance>,
  firstRemainingIndex: Int,
  which: Int,
  armyId: String,
  seed: Long?,
  imageUrl: String?,
): MutableList<TileInstance> {
  if (armyId != MERCHANTS_GUILD_ARMY_ID) return deck.toMutableList()
  val remaining = deck.size - firstRemainingIndex
  val rand = if (seed != null) mulberry32(seed xor if (which == 1) SALT_RESPAWN_1 else SALT_RESPAWN_2) else { { Math.random() } }
  val offset = if (remaining == 0) 0 else (rand() * (remaining + 1)).toInt()
  val insertAt = firstRemainingIndex + offset
  val copy = deck.toMutableList()
  copy.add(insertAt, createRespawnInstance(which, armyId, imageUrl))
  return copy
}

private fun createRespawnInstance(which: Int, armyId: String, imageUrl: String?): TileInstance =
  TileInstance(
    instanceId = "mg-respawn-$which-0",
    armyId = armyId,
    tile = TileDefinition(
      id = "mg-respawn-$which",
      name = if (which == 1) "Reconnaissance 1" else "Reconnaissance 2",
      category = TileCategory.INSTANT,
      count = 1,
      description = "Random mode only",
      imageUrl = imageUrl,
      imageOverlayLabel = if (which == 1) "RC1" else "RC2",
      excludeFromDeck = false,
      displayWithHq = false,
    )
  )

private fun wiremenTechBonusesRemaining(remaining: List<TileInstance>): Map<String, Int> {
  val out = linkedMapOf("ini0" to 0, "iniPlus1" to 0, "matka" to 0, "meleePlus1" to 0, "rangedPlus1" to 0)
  remaining.forEach { inst ->
    if (inst.tile.category != TileCategory.INSTANT) return@forEach
    wiremenBonusByTileId[inst.tile.id]?.forEach { (key, value) ->
      out[key] = (out[key] ?: 0) + value
    }
  }
  return out
}

private fun armyDisplayName(army: Army, locale: LocaleCode, display: DisplayData): String =
  if (locale == LocaleCode.PL) display.armyDisplayNamePl[army.id] ?: army.name else army.name

private fun armyDescription(army: Army, locale: LocaleCode, display: DisplayData): String =
  if (locale == LocaleCode.PL) display.armyDescriptionPl[army.id] ?: army.description else army.description

private fun armyHqAbility(army: Army, locale: LocaleCode, display: DisplayData): String =
  if (locale == LocaleCode.PL) display.armyHqAbilityPl[army.id] ?: army.hqAbility else army.hqAbility

private fun tileDisplayName(tile: TileDefinition, locale: LocaleCode, display: DisplayData): String {
  if (locale != LocaleCode.PL) return tile.name
  if (tile.name == "HQ") return "Sztab"
  return display.polishTileNameOverrides[tile.id] ?: display.enToPlTileNames[tile.name] ?: tile.name
}

private fun armySearchHaystack(army: Army, display: DisplayData): String =
  listOfNotNull(army.name, display.armyDisplayNamePl[army.id]).joinToString(" ").lowercase(Locale.ROOT)

private fun ironGangBanner(mode: String, army: Army, locale: LocaleCode, display: DisplayData): String {
  if (mode == "no-hook") return "This deck does not contain Hook."
  val replacedTileId = mode.removePrefix("replace:")
  val tile = army.tiles.firstOrNull { it.id == replacedTileId }
  val name = tile?.let { tileDisplayName(it, locale, display) } ?: replacedTileId
  return "This deck contains Hook. One $name was removed so Hook can be shuffled instead."
}

private fun tileSections(army: Army): List<Pair<String, List<TileDefinition>>> {
  val hqTile = TileDefinition(
    id = "${army.id}-hq",
    name = "HQ",
    category = TileCategory.HQ,
    count = 1,
    description = army.hqAbility,
    imageUrl = army.hqImageUrl,
    imageOverlayLabel = null,
    excludeFromDeck = false,
    displayWithHq = false,
  )
  val sections = mutableListOf<Pair<String, List<TileDefinition>>>()
  if (army.multiHeadquarters) {
    sections += "Headquarters" to army.tiles.filter { it.category == TileCategory.HQ }
  } else {
    sections += "Headquarters" to listOf(hqTile) + army.tiles.filter { it.displayWithHq }
  }
  sections += "Instant Tokens" to army.tiles.filter { it.category == TileCategory.INSTANT && !it.displayWithHq }
  sections += "Soldiers" to army.tiles.filter { it.category == TileCategory.SOLDIER && !it.displayWithHq }
  sections += "Implants" to army.tiles.filter { it.category == TileCategory.IMPLANT && !it.displayWithHq }
  sections += "Modules" to army.tiles.filter { it.category == TileCategory.MODULE && !it.displayWithHq }
  sections += "Foundations" to army.tiles.filter { it.category == TileCategory.FOUNDATION && !it.displayWithHq }
  return sections.filter { it.second.isNotEmpty() }
}

private fun deckCountsByCategory(army: Army): List<Pair<TileCategory, Int>> =
  buildMap {
    listOf(
      TileCategory.INSTANT,
      TileCategory.SOLDIER,
      TileCategory.IMPLANT,
      TileCategory.MODULE,
      TileCategory.FOUNDATION,
    ).forEach { category ->
      val count = army.tiles.filter { it.category == category && !it.excludeFromDeck }.sumOf { it.count }
      if (count > 0) put(category, count)
    }
  }.toList()

private fun categoryDeckLabelKey(category: TileCategory): String =
  when (category) {
    TileCategory.INSTANT -> "homeArmyDeckInstant"
    TileCategory.SOLDIER -> "homeArmyDeckSoldier"
    TileCategory.IMPLANT -> "homeArmyDeckImplant"
    TileCategory.FOUNDATION -> "homeArmyDeckFoundation"
    TileCategory.MODULE -> "homeArmyDeckModule"
    TileCategory.HQ -> "tileCatHq"
  }

private fun categoryLabelKey(category: TileCategory): String =
  when (category) {
    TileCategory.INSTANT -> "tileCatInstant"
    TileCategory.SOLDIER -> "tileCatSoldier"
    TileCategory.IMPLANT -> "tileCatImplant"
    TileCategory.FOUNDATION -> "tileCatFoundation"
    TileCategory.MODULE -> "tileCatModule"
    TileCategory.HQ -> "tileCatHq"
  }

private fun tileCategoryIcon(category: TileCategory): String =
  when (category) {
    TileCategory.HQ -> "🏛"
    TileCategory.INSTANT -> "⚡"
    TileCategory.SOLDIER -> "⚔"
    TileCategory.IMPLANT -> "🧬"
    TileCategory.FOUNDATION -> "🧱"
    TileCategory.MODULE -> "⚙"
  }

private fun tileCategoryOrder(category: TileCategory): Int =
  when (category) {
    TileCategory.HQ -> 0
    TileCategory.INSTANT -> 1
    TileCategory.SOLDIER -> 2
    TileCategory.IMPLANT -> 3
    TileCategory.FOUNDATION -> 4
    TileCategory.MODULE -> 5
  }

private fun sortTileGroupsByCategory(
  groups: List<Pair<TileDefinition, List<TileInstance>>>
): List<Pair<TileDefinition, List<TileInstance>>> =
  groups.sortedWith(compareBy({ tileCategoryOrder(it.first.category) }, { it.first.id }))

private fun categoryLabel(category: TileCategory): String =
  when (category) {
    TileCategory.INSTANT -> "Instant"
    TileCategory.SOLDIER -> "Soldier"
    TileCategory.IMPLANT -> "Implant"
    TileCategory.FOUNDATION -> "Foundation"
    TileCategory.MODULE -> "Module"
    TileCategory.HQ -> "HQ"
  }

private fun groupInstances(instances: List<TileInstance>): List<Pair<TileDefinition, List<TileInstance>>> {
  val grouped = linkedMapOf<String, MutableList<TileInstance>>()
  instances.forEach { inst ->
    grouped.getOrPut(inst.tile.id) { mutableListOf() }.add(inst)
  }
  return grouped.values.map { list -> list.first().tile to list }
}

private fun parseColor(value: String): Color {
  val normalized = value.trim()
  if (normalized.startsWith("rgba(") && normalized.endsWith(")")) {
    val parts = normalized.removePrefix("rgba(").removeSuffix(")").split(',').map { it.trim() }
    if (parts.size == 4) {
      val red = parts[0].toFloatOrNull()?.div(255f)
      val green = parts[1].toFloatOrNull()?.div(255f)
      val blue = parts[2].toFloatOrNull()?.div(255f)
      val alpha = parts[3].toFloatOrNull()
      if (red != null && green != null && blue != null && alpha != null) {
        return Color(red = red, green = green, blue = blue, alpha = alpha.coerceIn(0f, 1f))
      }
    }
  }
  return runCatching { Color(android.graphics.Color.parseColor(normalized)) }
    .getOrDefault(Color(0xFF6E8B3D))
}
