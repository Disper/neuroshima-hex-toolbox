import type { Army, TileCategory } from '../data/types';
import { TileCard } from './TileCard';

interface ArmyViewProps {
  army: Army;
  onStartDraw: () => void;
}

const sections: { category: TileCategory; label: string }[] = [
  { category: 'hq', label: 'Headquarters' },
  { category: 'instant', label: 'Instant Tokens' },
  { category: 'soldier', label: 'Soldiers' },
  { category: 'module', label: 'Modules' },
];

export function ArmyView({ army, onStartDraw }: ArmyViewProps) {
  const hqTile = {
    id: `${army.id}-hq`,
    name: 'HQ',
    category: 'hq' as TileCategory,
    count: 1,
    description: army.hqAbility,
    imageUrl: army.hqImageUrl,
  };

  const tilesWithHq = army.tiles.filter((t) => t.displayWithHq);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Army header */}
      <div
        className="rounded-2xl border border-stone-700 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1c1917 0%, #292524 100%)' }}
      >
        <div
          className="h-2"
          style={{ background: army.accentColor }}
        />
        <div className="p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <h1
                className="text-3xl sm:text-4xl font-bold tracking-tight"
                style={{ color: army.accentColor }}
              >
                {army.name}
              </h1>
              <p className="mt-2 text-stone-400 text-sm sm:text-base max-w-xl leading-relaxed">
                {army.description}
              </p>
            </div>
          </div>

          {/* HQ ability */}
          <div className="mt-5 rounded-lg border border-amber-500/30 bg-amber-950/30 px-4 py-3">
            <span className="text-amber-400 text-xs font-semibold uppercase tracking-wider">
              HQ Special Ability
            </span>
            <p className="text-stone-300 text-sm mt-1">{army.hqAbility}</p>
          </div>
        </div>
      </div>

      {/* Start draw button */}
      <button
        onClick={onStartDraw}
        className="w-full py-4 rounded-xl font-bold text-lg tracking-wide transition-all duration-200 hover:brightness-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-white/30"
        style={{ background: army.accentColor, color: '#fff' }}
      >
        Start Drawing Tiles
      </button>

      {/* Tile sections */}
      {sections.map(({ category, label }) => {
        if (category === 'hq') {
          const sectionTotal =
            1 + tilesWithHq.reduce((sum, t) => sum + t.count, 0);
          return (
            <section key={category}>
              <div className="flex items-baseline justify-between mb-3">
                <h2 className="text-lg font-semibold text-stone-200">{label}</h2>
                <span className="text-sm text-stone-500">
                  {sectionTotal} tile{sectionTotal !== 1 ? 's' : ''}
                </span>
              </div>
              <div className="flex flex-wrap gap-3 items-stretch">
                <TileCard tile={hqTile} />
                {tilesWithHq.map((tile) => (
                  <TileCard key={tile.id} tile={tile} />
                ))}
              </div>
            </section>
          );
        }

        const tiles = army.tiles.filter(
          (t) => t.category === category && !t.displayWithHq
        );
        if (tiles.length === 0) return null;
        const sectionTotal = tiles.reduce((sum, t) => sum + t.count, 0);
        return (
          <section key={category}>
            <div className="flex items-baseline justify-between mb-3">
              <h2 className="text-lg font-semibold text-stone-200">{label}</h2>
              <span className="text-sm text-stone-500">{sectionTotal} tile{sectionTotal !== 1 ? 's' : ''}</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {tiles.map((tile) => (
                <TileCard key={tile.id} tile={tile} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
