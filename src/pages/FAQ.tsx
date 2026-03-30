import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  Terminal,
  User,
  Building2,
  Shield,
  HelpCircle,
  Search,
  MessageSquare,
} from "lucide-react";
import { PageTransition } from "@/components/PageTransition";
import { Footer } from "@/components/Footer";
import { Link } from "react-router-dom";

// --- FAQ Data ---
interface FAQItem {
  question: string;
  answer: string | JSX.Element;
}

interface FAQSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  color: string;
  faqs: FAQItem[];
}

const faqSections: FAQSection[] = [
  {
    id: "portfolio",
    title: "Portfolio FAQs",
    icon: <User className="w-5 h-5" />,
    color: "#FFAB00",
    faqs: [
      {
        question: "How to create/edit my portfolio?",
        answer: (
          <div className="space-y-2">
            <p>
              Top right corner, click{" "}
              <span className="text-[#FFAB00] font-bold">Sign In</span> &
              register or login with your{" "}
              <span className="text-white font-semibold">Gmail ID</span> or{" "}
              <span className="text-[#7289DA] font-semibold">Discord</span>.
            </p>
            <p>
              Then just tap{" "}
              <span className="px-2 py-0.5 bg-[#FFAB00]/20 text-[#FFAB00] rounded text-sm font-bold">
                Create/Edit Portfolio
              </span>
            </p>
          </div>
        ),
      },
      {
        question: "Can I create multiple portfolios?",
        answer:
          "No. The same email ID cannot be used for multiple account creation. Each account is linked to one portfolio.",
      },
      {
        question: "Is my portfolio visible to game studios?",
        answer:
          "Yes! Your portfolio is visible to everyone who visits the website — including game studios, recruiters, and other developers.",
      },
      {
        question: "What file formats are accepted for CV?",
        answer:
          "The accepted format is PDF. You can verify the supported formats in the upload section while uploading your CV.",
      },
      {
        question: "Can I update my portfolio anytime?",
        answer: (
          <p>
            Yes, you can edit/update your portfolio anytime. Just make sure to
            click{" "}
            <span className="px-2 py-0.5 bg-green-500/20 text-green-400 rounded text-sm font-bold">
              Submit
            </span>{" "}
            to save your changes.
          </p>
        ),
      },
      {
        question: "How to delete my portfolio?",
        answer: (
          <p>
            To delete your portfolio, please reach out via{" "}
            <a
              href="https://www.linkedin.com/in/gametout/?originalSubdomain=in"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#FFAB00] underline hover:text-white transition-colors"
            >
              LinkedIn
            </a>
            . Our team will assist you with the deletion process.
          </p>
        ),
      },
    ],
  },
  {
    id: "studio",
    title: "Studio FAQs",
    icon: <Building2 className="w-5 h-5" />,
    color: "#00D4FF",
    faqs: [
      {
        question: "How to create/edit my Studio Profile?",
        answer: (
          <div className="space-y-2">
            <p>
              Top right corner, click{" "}
              <span className="text-[#FFAB00] font-bold">Sign In</span> &
              register or login with your{" "}
              <span className="text-white font-semibold">Gmail ID</span> or{" "}
              <span className="text-[#7289DA] font-semibold">Discord</span>.
            </p>
            <p>
              Then just tap{" "}
              <span className="px-2 py-0.5 bg-[#00D4FF]/20 text-[#00D4FF] rounded text-sm font-bold">
                Submit Studio
              </span>
            </p>
          </div>
        ),
      },
      {
        question: "Is my Studio Profile visible to candidates?",
        answer:
          "Yes! Your Studio Profile is visible to everyone who visits the website — developers, artists, and all talent can discover your studio.",
      },
      {
        question: "Can I update my Studio Profile anytime?",
        answer: (
          <p>
            Yes, you can edit/update your Studio Profile anytime. Just make sure
            to click{" "}
            <span className="px-2 py-0.5 bg-green-500/20 text-green-400 rounded text-sm font-bold">
              Submit
            </span>{" "}
            to save your changes.
          </p>
        ),
      },
      {
        question: "How to delete my Studio Profile?",
        answer: (
          <p>
            To delete your Studio Profile, please reach out via{" "}
            <a
              href="https://www.linkedin.com/in/gametout/?originalSubdomain=in"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#FFAB00] underline hover:text-white transition-colors"
            >
              LinkedIn
            </a>
            . Our team will handle it for you.
          </p>
        ),
      },
    ],
  },
  {
    id: "account",
    title: "Account & Support FAQs",
    icon: <Shield className="w-5 h-5" />,
    color: "#A855F7",
    faqs: [
      {
        question: "What if I forget my password?",
        answer:
          "Your account is connected through Gmail or Discord — there's no separate password to remember. Simply sign in with the same provider you used to register.",
      },
      {
        question: "Can I delete my account?",
        answer: (
          <p>
            Yes. To request account deletion, please reach out via{" "}
            <a
              href="https://www.linkedin.com/in/gametout/?originalSubdomain=in"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#FFAB00] underline hover:text-white transition-colors"
            >
              LinkedIn
            </a>
            . Your data will be permanently removed.
          </p>
        ),
      },
      {
        question: "How to ask for any website-related help?",
        answer: (
          <p>
            Just go to the{" "}
            <a
              href="https://www.linkedin.com/in/gametout/?originalSubdomain=in"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#FFAB00] underline hover:text-white transition-colors"
            >
              LinkedIn
            </a>
            and send us a message. We'll get back to you as soon as possible.
          </p>
        ),
      },
    ],
  },
];

// --- Accordion Item ---
const AccordionItem = ({
  faq,
  isOpen,
  onToggle,
  index,
  color,
}: {
  faq: FAQItem;
  isOpen: boolean;
  onToggle: () => void;
  index: number;
  color: string;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="border-b border-white/[0.06] last:border-b-0"
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-3 py-4 px-4 text-left group hover:bg-white/[0.02] transition-colors"
      >
        {/* Index number */}
        <span
          className="text-[10px] font-mono font-bold w-6 h-6 rounded flex items-center justify-center shrink-0 transition-colors"
          style={{
            backgroundColor: isOpen ? `${color}20` : "rgba(255,255,255,0.05)",
            color: isOpen ? color : "#6b7280",
          }}
        >
          {String(index + 1).padStart(2, "0")}
        </span>

        {/* Question */}
        <span
          className={`flex-1 text-sm sm:text-base font-medium transition-colors ${isOpen ? "text-white" : "text-gray-400 group-hover:text-white"
            }`}
        >
          {faq.question}
        </span>

        {/* Chevron */}
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="shrink-0"
        >
          <ChevronDown
            className="w-4 h-4 transition-colors"
            style={{ color: isOpen ? color : "#6b7280" }}
          />
        </motion.div>
      </button>

      {/* Answer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pl-[52px]">
              <div
                className="text-sm text-gray-400 leading-relaxed border-l-2 pl-4"
                style={{ borderColor: `${color}40` }}
              >
                {faq.answer}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// --- Section Nav Button ---
const SectionNavButton = ({
  section,
  isActive,
  onClick,
}: {
  section: FAQSection;
  isActive: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold uppercase tracking-wide transition-all whitespace-nowrap shrink-0 ${isActive
      ? "text-black shadow-lg"
      : "bg-white/[0.04] text-gray-500 hover:text-white hover:bg-white/[0.08] border border-white/[0.06]"
      }`}
    style={
      isActive
        ? {
          backgroundColor: section.color,
          boxShadow: `0 0 20px ${section.color}40`,
        }
        : {}
    }
  >
    {section.icon}
    <span className="hidden sm:inline">{section.title}</span>
    <span className="sm:hidden">{section.title.split(" ")[0]}</span>
  </button>
);

// --- Main FAQ Page ---
const FAQ = () => {
  const [activeSection, setActiveSection] = useState("portfolio");
  const [openItems, setOpenItems] = useState<Record<string, number | null>>({
    portfolio: 0,
    studio: null,
    account: null,
  });
  const [searchQuery, setSearchQuery] = useState("");

  const toggleItem = (sectionId: string, index: number) => {
    setOpenItems((prev) => ({
      ...prev,
      [sectionId]: prev[sectionId] === index ? null : index,
    }));
  };

  // Filter FAQs by search
  const filteredSections = faqSections
    .map((section) => ({
      ...section,
      faqs: section.faqs.filter((faq) => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        const answerText =
          typeof faq.answer === "string"
            ? faq.answer
            : (faq.answer as any)?.props?.children?.toString() || "";
        return (
          faq.question.toLowerCase().includes(query) ||
          answerText.toLowerCase().includes(query)
        );
      }),
    }))
    .filter((section) => section.faqs.length > 0);

  const currentSection = searchQuery
    ? filteredSections
    : faqSections.filter((s) => s.id === activeSection);

  return (
    <PageTransition>
      <main className="min-h-screen bg-background pt-24 pb-20 selection:bg-[#FFAB00] selection:text-black relative overflow-hidden">
        {/* BG Effects */}
        <div
          className="fixed inset-0 pointer-events-none z-0 opacity-20"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,171,0,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,171,0,0.05) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        />
        <div className="fixed inset-0 pointer-events-none z-0 bg-gradient-to-b from-background via-transparent to-background" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 md:px-8">
          {/* Header */}
          <div className="mb-10">
            <div className="flex items-center gap-2 text-xs font-mono text-gray-600 mb-3">
              <Terminal className="w-3 h-3 text-[#FFAB00]" />
              <span>WEBUILDGAME</span>
              <span className="text-[#FFAB00]">//</span>
              <span>SUPPORT</span>
            </div>

            <h1 className="font-display text-4xl md:text-5xl text-white uppercase tracking-tight leading-none mb-3">
              Frequently Asked
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFAB00] via-yellow-400 to-[#FFAB00] ml-3">
                Questions
              </span>
            </h1>

            <p className="text-gray-500 font-mono text-sm max-w-lg">
              Everything you need to know about portfolios, studio profiles, and
              your account.
            </p>
          </div>

          {/* Search */}
          <div className="relative mb-6">
            <Search
              className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${searchQuery ? "text-[#FFAB00]" : "text-gray-600"
                }`}
            />
            <input
              type="text"
              placeholder="Search questions..."
              className="w-full bg-white/[0.04] border border-white/[0.06] rounded-lg pl-12 pr-4 py-3 text-sm text-white focus:outline-none focus:border-[#FFAB00]/50 focus:bg-white/[0.06] focus:shadow-[0_0_0_3px_rgba(255,171,0,0.08)] transition-all duration-300 font-mono placeholder:text-gray-600"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>

          {/* Section Navigation - only when not searching */}
          {!searchQuery && (
            <div className="flex items-center gap-2 mb-8 overflow-x-auto scrollbar-none pb-1">
              {faqSections.map((section) => (
                <SectionNavButton
                  key={section.id}
                  section={section}
                  isActive={activeSection === section.id}
                  onClick={() => setActiveSection(section.id)}
                />
              ))}
            </div>
          )}

          {/* FAQ Content */}
          <AnimatePresence mode="wait">
            {currentSection.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-16"
              >
                <HelpCircle className="w-12 h-12 text-gray-700 mx-auto mb-4" />
                <p className="text-gray-500 font-mono">
                  No questions found for "{searchQuery}"
                </p>
              </motion.div>
            ) : (
              currentSection.map((section) => (
                <motion.div
                  key={section.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="mb-8"
                >
                  {/* Section Header (shown when searching) */}
                  {searchQuery && (
                    <div className="flex items-center gap-2 mb-3">
                      <span style={{ color: section.color }}>
                        {section.icon}
                      </span>
                      <h2
                        className="text-sm font-bold uppercase tracking-wider"
                        style={{ color: section.color }}
                      >
                        {section.title}
                      </h2>
                    </div>
                  )}

                  {/* FAQ Items */}
                  <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl overflow-hidden">
                    {section.faqs.map((faq, index) => (
                      <AccordionItem
                        key={index}
                        faq={faq}
                        isOpen={openItems[section.id] === index}
                        onToggle={() => toggleItem(section.id, index)}
                        index={index}
                        color={section.color}
                      />
                    ))}
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-12 text-center p-8 bg-white/[0.02] border border-white/[0.06] rounded-xl"
          >
            <MessageSquare className="w-8 h-8 text-[#FFAB00] mx-auto mb-3" />
            <h3 className="font-display text-xl text-white uppercase mb-2">
              Still have questions?
            </h3>
            <p className="text-gray-500 text-sm mb-4 font-mono">
              Can't find what you're looking for? Reach out to us.
            </p>
            <a
              href="https://www.linkedin.com/in/gametout/?originalSubdomain=in"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#FFAB00] to-[#FF8C00] text-black font-bold uppercase text-sm tracking-wide rounded-sm hover:shadow-[0_0_20px_rgba(255,171,0,0.3)] transition-shadow"
            >
              Contact on LinkedIn
            </a>
          </motion.div>
        </div>

        <div className="mt-20">
          <Footer />
        </div>
      </main>
    </PageTransition>
  );
};

export default FAQ;