const fakeMembers = [
  { initials: "AK", color: "hsl(42 60% 54%)" },
  { initials: "MR", color: "hsl(200 50% 50%)" },
  { initials: "JS", color: "hsl(150 45% 45%)" },
  { initials: "LP", color: "hsl(280 40% 50%)" },
  { initials: "DW", color: "hsl(10 60% 55%)" },
  { initials: "NC", color: "hsl(42 50% 42%)" },
];

const AvatarStack = () => (
  <div className="flex items-center gap-3">
    <div className="flex -space-x-2.5">
      {fakeMembers.map((m) => (
        <div
          key={m.initials}
          className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-background text-[10px] font-bold text-white"
          style={{ backgroundColor: m.color }}
        >
          {m.initials}
        </div>
      ))}
    </div>
    <span className="text-xs text-muted-foreground">
      <span className="font-semibold text-foreground">80+</span> already joined
    </span>
  </div>
);

export default AvatarStack;
