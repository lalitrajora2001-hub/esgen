/** Clean SVG explainer of the three GHG Protocol scopes. Accurate, plain-language. */
export function ScopeDiagram() {
  const scopes = [
    {
      tag: "Scope 1",
      colour: "#8fbaff",
      title: "Direct emissions",
      body: "Sources you own or control, such as company vehicles and on-site fuel combustion.",
    },
    {
      tag: "Scope 2",
      colour: "#3fb6a8",
      title: "Purchased energy",
      body: "Indirect emissions from the electricity, steam, heating, and cooling you buy.",
    },
    {
      tag: "Scope 3",
      colour: "#4d8bf5",
      title: "Value chain",
      body: "All other indirect emissions across 15 categories, upstream and downstream. Usually the largest.",
    },
  ];
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {scopes.map((s) => (
        <div key={s.tag} className="card-surface p-5">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full" style={{ background: s.colour }} />
            <span className="font-mono text-xs uppercase tracking-wider" style={{ color: s.colour }}>{s.tag}</span>
          </div>
          <h3 className="mt-3 font-display text-lg font-semibold">{s.title}</h3>
          <p className="mt-2 text-sm text-text-muted">{s.body}</p>
        </div>
      ))}
    </div>
  );
}
