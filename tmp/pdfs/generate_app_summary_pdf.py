from datetime import date
from pathlib import Path

PAGE_WIDTH = 612
PAGE_HEIGHT = 792
MARGIN_X = 54
TOP_Y = 758
BOTTOM_Y = 48


def esc(text: str) -> str:
    return text.replace('\\', '\\\\').replace('(', '\\(').replace(')', '\\)')


def wrap_text(text: str, max_chars: int) -> list[str]:
    words = text.split()
    if not words:
        return [""]
    lines: list[str] = []
    current = words[0]
    for word in words[1:]:
        candidate = f"{current} {word}"
        if len(candidate) <= max_chars:
            current = candidate
        else:
            lines.append(current)
            current = word
    lines.append(current)
    return lines


class Layout:
    def __init__(self) -> None:
        self.y = TOP_Y
        self.commands: list[str] = []

    def _line(self, text: str, font: str, size: float, x: float, leading: float) -> None:
        self.commands.append(
            f"BT /{font} {size:.2f} Tf 1 0 0 1 {x:.2f} {self.y:.2f} Tm ({esc(text)}) Tj ET"
        )
        self.y -= leading

    def title(self, text: str) -> None:
        self._line(text, "F2", 16, MARGIN_X, 20)

    def subtitle(self, text: str) -> None:
        for line in wrap_text(text, 95):
            self._line(line, "F1", 9.5, MARGIN_X, 12)
        self.y -= 4

    def section(self, heading: str) -> None:
        self._line(heading, "F2", 11.5, MARGIN_X, 14)

    def body(self, text: str) -> None:
        for line in wrap_text(text, 100):
            self._line(line, "F1", 9.6, MARGIN_X, 12)

    def bullet(self, text: str) -> None:
        wrapped = wrap_text(text, 92)
        if not wrapped:
            return
        self._line(f"- {wrapped[0]}", "F1", 9.6, MARGIN_X + 8, 12)
        for line in wrapped[1:]:
            self._line(f"  {line}", "F1", 9.6, MARGIN_X + 8, 12)

    def number(self, number: int, text: str) -> None:
        wrapped = wrap_text(text, 90)
        if not wrapped:
            return
        self._line(f"{number}. {wrapped[0]}", "F1", 9.6, MARGIN_X + 8, 12)
        for line in wrapped[1:]:
            self._line(f"   {line}", "F1", 9.6, MARGIN_X + 8, 12)


layout = Layout()
layout.title("theatre.ai App Summary (One Page)")
layout.subtitle(
    f"Generated from repository evidence on {date.today().isoformat()} - scope includes README, src/, docs/, and config files."
)

layout.section("What it is")
layout.body(
    "theatre.ai is a React + TypeScript web app for managing AI-era performance rights in entertainment."
)
layout.body(
    "It combines CastID-style verification, consent-controlled digital assets, licensing, and collaboration workflows in a single frontend experience."
)
layout.y -= 2

layout.section("Who it is for")
layout.body(
    "Primary persona: actors and artists who need to protect and license voice, likeness, and motion rights."
)
layout.body(
    "Also represented in product flows: studios, agencies, and legal users via role-based onboarding."
)
layout.y -= 2

layout.section("What it does")
layout.bullet("Role-based onboarding and sign-in with identity and professional verification states.")
layout.bullet("Vault workflow for voice/face/motion uploads, per-asset visibility, consent matrix controls, and usage logs.")
layout.bullet("Search and discovery across actors, studios, agencies, and casting calls with filter panels.")
layout.bullet("Messaging center with requests, secure attachment presets, referenced assets, and conversation states.")
layout.bullet("Contracts workspace with status filters, clause highlights, and mock license certificate generation.")
layout.bullet("Payments flow showing studio pay-in, platform fee split, actor payout statuses, and downloadable receipts.")
layout.bullet("Feed and network areas for posts, communities, events, and professional connection management.")
layout.y -= 2

layout.section("How it works (repo evidence only)")
layout.bullet("Frontend SPA: Vite + React + TypeScript entrypoint at src/main.tsx and route graph in src/App.tsx.")
layout.bullet("Routing: react-router-dom with public pages plus dashboard and canonical route aliases.")
layout.bullet("UI composition: shared layout components (DashboardLayout, DashboardTopNav) and shadcn-ui/Tailwind primitives.")
layout.bullet("State/data layer: src/lib/store.ts uses localStorage helpers and in-repo mock datasets.")
layout.bullet("Data flow: user actions update component state, store helpers persist to localStorage, UI re-renders with toast feedback.")
layout.bullet("Backend API services, server runtime, and production database: Not found in repo.")
layout.y -= 2

layout.section("How to run (minimal)")
layout.number(1, "Install Node.js and npm (README lists this prerequisite).")
layout.number(2, "From repo root, install dependencies: npm i")
layout.number(3, "Start dev server: npm run dev (vite.config.ts sets port 8080).")

if layout.y < BOTTOM_Y:
    raise SystemExit(f"Layout overflowed page: final y={layout.y:.2f}")

content = "\n".join(layout.commands) + "\n"
content_bytes = content.encode("latin-1", errors="replace")

obj1 = b"<< /Type /Catalog /Pages 2 0 R >>"
obj2 = b"<< /Type /Pages /Kids [3 0 R] /Count 1 >>"
obj3 = (
    b"<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] "
    b"/Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /Contents 6 0 R >>"
)
obj4 = b"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>"
obj5 = b"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>"
obj6 = (
    f"<< /Length {len(content_bytes)} >>\nstream\n".encode("ascii")
    + content_bytes
    + b"endstream"
)

objects = [obj1, obj2, obj3, obj4, obj5, obj6]

pdf = bytearray()
pdf.extend(b"%PDF-1.4\n")
offsets = [0]
for i, obj in enumerate(objects, start=1):
    offsets.append(len(pdf))
    pdf.extend(f"{i} 0 obj\n".encode("ascii"))
    pdf.extend(obj)
    pdf.extend(b"\nendobj\n")

xref_start = len(pdf)
pdf.extend(f"xref\n0 {len(objects) + 1}\n".encode("ascii"))
pdf.extend(b"0000000000 65535 f \n")
for off in offsets[1:]:
    pdf.extend(f"{off:010d} 00000 n \n".encode("ascii"))

pdf.extend(
    (
        "trailer\n"
        f"<< /Size {len(objects) + 1} /Root 1 0 R >>\n"
        "startxref\n"
        f"{xref_start}\n"
        "%%EOF\n"
    ).encode("ascii")
)

out_path = Path("output/pdf/theatre-ai-app-summary-one-page.pdf")
out_path.write_bytes(pdf)
print(out_path)
