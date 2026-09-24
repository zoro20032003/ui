import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { JSDOM } from "jsdom";
import { beforeAll, describe, expect, it } from "vitest";

/**
 * The deliverable for this build is a single self-contained HTML artifact at
 * `public/showcase.html` (served by `index.html`). It is not a React app, so
 * these tests parse the artifact from disk and assert the accepted observable
 * structure, theming, typography, and screen content.
 */

const SHOWCASE_PATH = resolve(process.cwd(), "public/showcase.html");

let html = "";
let doc: Document;

beforeAll(() => {
  html = readFileSync(SHOWCASE_PATH, "utf8");
  doc = new JSDOM(html).window.document;
});

const text = (): string => doc.body.textContent ?? "";

const screenBlocks = (): Element[] =>
  Array.from(doc.querySelectorAll("section.screen-block"));

const phoneFrames = (): Element[] => Array.from(doc.querySelectorAll(".phone"));

const labelFor = (frame: Element): string =>
  frame.closest("section.screen-block")?.querySelector(".screen-label")
    ?.textContent ?? "";

describe("showcase artifact", () => {
  it("renders a non-empty document with all phone frames", () => {
    expect(html.length).toBeGreaterThan(1000);
    expect(doc.querySelector("main.page")).not.toBeNull();
    expect(phoneFrames().length).toBe(14);
    expect(screenBlocks().length).toBe(14);
  });

  it("declares RTL Arabic on the html element", () => {
    const root = doc.documentElement;
    expect(root.getAttribute("dir")).toBe("rtl");
    expect(root.getAttribute("lang")).toBe("ar");
  });

  it("gives every phone frame a 390x844 size and an Arabic screen name above it", () => {
    const frames = phoneFrames();
    expect(frames.length).toBeGreaterThan(0);
    for (const frame of frames) {
      const label = labelFor(frame);
      expect(label.trim().length).toBeGreaterThan(0);
      // The label must contain Arabic letters.
      expect(/[\u0600-\u06FF]/.test(label)).toBe(true);
    }
    // The frame dimensions are declared in the stylesheet.
    expect(html).toMatch(/\.phone\s*\{[^}]*width:\s*390px/);
    expect(html).toMatch(/\.phone\s*\{[^}]*height:\s*844px/);
  });

  it("uses Western digits only, never Arabic-Indic numerals", () => {
    // Arabic-Indic digits U+0660..U+0669 and extended U+06F0..U+06F9.
    expect(/[\u0660-\u0669\u06F0-\u06F9]/.test(text())).toBe(false);
    // Western digits are present (page counts, scores, stats).
    expect(/[0-9]/.test(text())).toBe(true);
  });
});

describe("theming", () => {
  it("defaults to the mint theme on <html>", () => {
    expect(doc.documentElement.getAttribute("data-theme")).toBe("mint");
  });

  it("defines all four themes", () => {
    for (const theme of ["mint", "ocean", "lavender", "dark"]) {
      expect(html).toContain(`[data-theme="${theme}"]`);
    }
  });

  it("uses the exact mint theme token values", () => {
    const mintBlock = html.match(
      /:root,\s*\[data-theme="mint"\]\s*\{([\s\S]*?)\}/,
    );
    expect(mintBlock).not.toBeNull();
    const block = mintBlock?.[1] ?? "";
    const expected: Record<string, string> = {
      "--primary": "#26A69A",
      "--primary-dark": "#1E8C82",
      "--background": "#EAF7F4",
      "--surface": "#FFFFFF",
      "--text": "#1F2A2E",
      "--muted": "#6B7C80",
      "--line": "#E3ECEA",
      "--accent": "#F5A623",
    };
    for (const [token, value] of Object.entries(expected)) {
      expect(block).toMatch(new RegExp(`${token}\\s*:\\s*${value}\\s*;`, "i"));
    }
  });

  it("recolors the whole showcase through CSS variables rather than hard-coded colors", () => {
    // The phone frame background must be driven by the theme token.
    expect(html).toMatch(/\.phone\s*\{[^}]*background:\s*var\(--background\)/);
  });
});

describe("typography", () => {
  it("loads Readex Pro for headings and IBM Plex Sans Arabic for body", () => {
    expect(html).toContain("Readex+Pro");
    expect(html).toContain("IBM+Plex+Sans+Arabic");
    expect(html).toMatch(
      /h1,\s*h2,\s*h3,\s*h4,\s*h5,\s*h6\s*\{[^}]*font-family:\s*"Readex Pro"/,
    );
    expect(html).toMatch(/body\s*\{[^}]*font-family:\s*"IBM Plex Sans Arabic"/);
  });
});

describe("icons and imagery", () => {
  it("uses inline SVG icons with a 1.75px stroke", () => {
    const svgs = Array.from(doc.querySelectorAll("svg"));
    expect(svgs.length).toBeGreaterThan(0);
    // 1.75 is the icon stroke. The other widths are deliberate and belong to
    // non-icon artwork: the status-bar wifi glyph (1.4), the logo/illustration
    // decorative strokes (2, 2.4, 2.6, 2.8), and the score ring (12).
    const allowed = new Set(["1.4", "1.75", "2", "2.4", "2.6", "2.8", "12"]);
    const strokeWidths = Array.from(
      html.matchAll(/stroke-width="([\d.]+)"/g),
    ).map((m) => m[1]);
    expect(strokeWidths.length).toBeGreaterThan(0);
    expect(strokeWidths).toContain("1.75");
    for (const width of strokeWidths) {
      expect(allowed.has(width)).toBe(true);
    }
    // 1.75 must be the dominant stroke, i.e. the icon stroke.
    const iconStrokes = strokeWidths.filter((w) => w === "1.75").length;
    expect(iconStrokes).toBeGreaterThan(strokeWidths.length / 2);
  });

  it("references no external image files", () => {
    expect(doc.querySelectorAll("img")).toHaveLength(0);
    expect(html).not.toMatch(/<img\b/i);
    expect(html).not.toMatch(/url\(\s*['"]?https?:/i);
    expect(html).not.toMatch(/\.(png|jpe?g|gif|webp|avif)\b/i);
  });

  it("renders book covers as CSS/SVG placeholders", () => {
    expect(doc.querySelectorAll(".cover").length).toBeGreaterThan(0);
    expect(doc.querySelectorAll(".bc-cover").length).toBeGreaterThan(0);
    expect(doc.querySelectorAll(".bm-cover").length).toBeGreaterThan(0);
  });
});

describe("logo", () => {
  it("shows the original صديقك logo on onboarding, login, and account screens", () => {
    const blocks = screenBlocks();
    const findBlock = (label: string): Element | undefined =>
      blocks.find((b) =>
        (b.querySelector(".screen-label")?.textContent ?? "").includes(label),
      );

    const onboarding = findBlock("التهيئة");
    const login = findBlock("تسجيل الدخول");
    const account = findBlock("حسابي");

    expect(onboarding).toBeDefined();
    expect(login).toBeDefined();
    expect(account).toBeDefined();

    for (const block of [onboarding, login, account]) {
      expect(block?.querySelector(".logo-mark svg")).not.toBeNull();
      expect(block?.textContent).toContain("صديقك");
    }
  });
});

describe("screen content", () => {
  const blockText = (label: string): string => {
    const block = screenBlocks().find((b) =>
      (b.querySelector(".screen-label")?.textContent ?? "").includes(label),
    );
    return block?.textContent ?? "";
  };

  it("onboarding shows the three exact slide titles with تخطي and a round next button", () => {
    const titles = [
      "كتابك وملزمتك في مكان واحد",
      "اختبر نفسك بأسئلة وزارية",
      "تابع تقدمك يومًا بيوم",
    ];
    for (const title of titles) {
      expect(text()).toContain(title);
    }
    expect(doc.querySelectorAll(".onboard .skip").length).toBe(3);
    expect(doc.querySelectorAll(".onboard .round-next").length).toBe(3);
  });

  it("home shows greeting, badge, search, announcement, progress, and bottom nav", () => {
    const home = blockText("الرئيسية");
    expect(home).toContain("مرحبًا، علي");
    expect(home).toContain("طالب مجتهد");
    expect(home).toContain("ابحث في الكتاب والملازم");
    expect(home).toContain("اختبار نهاية الفصل الأول جاهز");
    expect(home).toContain("ابدأ");
    expect(home).toContain("وصلت إلى صفحة 52 من 288");
    for (const nav of ["الرئيسية", "الكتب", "الملازم", "الاختبارات", "حسابي"]) {
      expect(home).toContain(nav);
    }
    expect(doc.querySelectorAll(".bottom-nav").length).toBeGreaterThanOrEqual(
      3,
    );
  });

  it("booklets store shows the four filter chips and a 2-column grid with a ملزمتي badge", () => {
    const store = blockText("متجر الملازم");
    for (const chip of [
      "الكل",
      "ملازم المدرّسين",
      "ملازم صديقك",
      "أقرؤها الآن",
    ]) {
      expect(store).toContain(chip);
    }
    expect(html).toMatch(/\.grid-2\s*\{[^}]*grid-template-columns:\s*1fr 1fr/);
    expect(doc.querySelectorAll(".booklet-card .mine").length).toBeGreaterThan(
      0,
    );
  });

  it("booklet detail shows teacher, stats, and parts with افتح", () => {
    const detail = blockText("تفاصيل الملزمة");
    expect(detail).toContain("الأستاذ أيوب أحمد");
    expect(detail).toContain("222");
    expect(detail).toContain("19.8 MB");
    expect(detail).toContain("2027");
    expect(detail).toContain("الجزء 1");
    expect(detail).toContain("الجزء 2");
    expect(detail).toContain("افتح");
    expect(detail).toContain("اجعلها ملزمتي");
    expect(detail).toContain("ابدأ القراءة");
  });

  it("reader shows segmented tabs, page counter, toolbar, and settings sheet", () => {
    const reader = blockText("القارئ");
    expect(reader).toContain("الكتاب");
    expect(reader).toContain("الملزمة");
    expect(reader).toContain("52 / 288");
    for (const tool of [
      "قلم",
      "تظليل",
      "ممحاة",
      "تراجع",
      "تكبير",
      "تصغير",
      "بحث",
    ]) {
      expect(reader).toContain(tool);
    }
    expect(reader).toContain("فاتح");
    expect(reader).toContain("داكن");
    expect(reader).toContain("سيبيا");
    expect(doc.querySelectorAll(".font-sizes .fs").length).toBe(3);
  });

  it("exam setup shows title, official exam card, source chips, and stepper", () => {
    const setup = blockText("إعداد الاختبار");
    expect(setup).toContain("اختبار الفصل الأول");
    expect(setup).toContain("اختبار نهاية الفصل");
    expect(setup).toContain("10 أسئلة");
    expect(setup).toContain("ابدأه");
    expect(setup).toContain("ابدأ الاختبار");
    expect(doc.querySelectorAll(".stepper").length).toBeGreaterThan(0);
  });

  it("exam question shows progress, question, option states, and feedback", () => {
    const question = blockText("سؤال الاختبار");
    expect(question).toContain("السؤال 3 من 10");
    expect(question).toContain("ما وحدة التعجيل؟");
    expect(question).toContain("إجابة صحيحة، أحسنت");
    expect(question).toContain("التالي");
    expect(question).toContain("تخطَّ");
    expect(doc.querySelectorAll(".option.selected").length).toBeGreaterThan(0);
    expect(doc.querySelectorAll(".option.correct").length).toBeGreaterThan(0);
    expect(doc.querySelectorAll(".option.wrong").length).toBeGreaterThan(0);
  });

  it("exam result shows the score ring, topic bars, and action buttons", () => {
    const result = blockText("نتيجة الاختبار");
    expect(result).toContain("8/10");
    expect(result).toContain("راجع أخطائي");
    expect(result).toContain("اختبار نقاط الضعف");
    expect(doc.querySelectorAll(".score-ring").length).toBe(1);
    expect(doc.querySelectorAll(".topic-bar").length).toBeGreaterThanOrEqual(3);
  });

  it("login shows logo, welcome heading, fields, actions, and signup link", () => {
    const login = blockText("تسجيل الدخول");
    expect(login).toContain("أهلًا بعودتك");
    expect(login).toContain("رقم الهاتف أو البريد الإلكتروني");
    expect(login).toContain("كلمة المرور");
    expect(login).toContain("تسجيل الدخول");
    expect(login).toContain("نسيت كلمة المرور؟");
    expect(login).toContain("إنشاء حساب جديد");
    expect(doc.querySelectorAll(".login-wrap .divider").length).toBe(1);
  });

  it("logout confirmation shows both actions", () => {
    const logout = blockText("تأكيد تسجيل الخروج");
    expect(logout).toContain("تسجيل الخروج");
    expect(logout).toContain("إلغاء");
  });

  it("account shows name, branch, three stats, and rows with chevrons", () => {
    const account = blockText("حسابي");
    expect(account).toContain("علي حسين");
    expect(account).toContain("السادس العلمي — الفرع العلمي");
    expect(doc.querySelectorAll(".stat-cards .stat-card").length).toBe(3);
    for (const row of [
      "معلوماتي",
      "إنجازاتي",
      "الملازم المحفوظة",
      "الإشعارات",
      "الألوان والمظهر",
      "حول التطبيق",
      "تسجيل الخروج",
    ]) {
      expect(account).toContain(row);
    }
    expect(doc.querySelectorAll(".row-item .chev").length).toBeGreaterThan(0);
  });

  it("settings shows theme swatches, toggles, and rows", () => {
    const settings = blockText("الإعدادات");
    expect(settings).toContain("الألوان");
    expect(settings).toContain("الوضع الداكن");
    expect(settings).toContain("حجم الخط");
    expect(settings).toContain("الإشعارات");
    expect(settings).toContain("حول التطبيق");
    expect(settings).toContain("تسجيل الخروج");
    expect(doc.querySelectorAll(".theme-swatch").length).toBe(4);
    expect(doc.querySelectorAll(".toggle").length).toBeGreaterThanOrEqual(2);
  });
});

describe("visual constraints", () => {
  it("uses soft shadows only and no backdrop blur", () => {
    expect(html).toContain("0 2px 8px rgba(0, 0, 0, 0.06)");
    expect(html).not.toMatch(/backdrop-filter/i);
  });

  it("limits animations to transform and opacity", () => {
    const keyframes = Array.from(
      html.matchAll(/@keyframes\s+\w+\s*\{([\s\S]*?)\n\}/g),
    );
    expect(keyframes.length).toBeGreaterThan(0);
    for (const [, body] of keyframes) {
      const props = Array.from(body.matchAll(/([a-z-]+)\s*:/g)).map(
        (m) => m[1],
      );
      for (const prop of props) {
        expect(["transform", "opacity"]).toContain(prop);
      }
    }
  });

  it("keeps touch targets at least 44px", () => {
    expect(html).toMatch(/\.btn\s*\{[^}]*min-height:\s*44px/);
    expect(html).toMatch(/\.icon-btn\s*\{[^}]*width:\s*44px/);
    expect(html).toMatch(/\.icon-btn\s*\{[^}]*height:\s*44px/);
    expect(html).toMatch(/\.chip\s*\{[^}]*min-height:\s*44px/);
  });

  it("provides hover and focus transitions", () => {
    expect(html).toMatch(/:focus-visible\s*\{/);
    expect(html).toMatch(/\.btn:hover\s*\{/);
    expect(html).toMatch(/transition:\s*transform/);
  });
});
