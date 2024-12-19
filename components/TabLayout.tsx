import { ReactNode, useState } from 'react';

interface TabLayoutProps {
  defaultTab?: string;
  tabs: {
    label: string;
    content: ReactNode;
  }[];
}

export default function TabLayout({ defaultTab, tabs }: TabLayoutProps) {
  if (!tabs || tabs.length === 0) return null;
  
  const [activeTab, setActiveTab] = useState(defaultTab || (tabs?.[0]?.label ?? ''));
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="w-full">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-10 bg-[#FFF5EA] border-b border-[#4A2B1B]/10">
        <div className="flex items-center justify-between h-16 px-4">
          <span className="text-xl font-lobster text-[#4A2B1B]">{activeTab}</span>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="w-10 h-10 flex items-center justify-center text-[#4A2B1B]/60 hover:text-[#4A2B1B]"
          >
            <svg 
              className="w-6 h-6" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-20 bg-[#FFF5EA]">
          <div className="h-16 flex items-center justify-between px-4 border-b border-[#4A2B1B]/10">
            <span className="text-xl font-lobster text-[#4A2B1B]">Menu</span>
            <button
              onClick={() => setIsMenuOpen(false)}
              className="w-10 h-10 flex items-center justify-center text-[#4A2B1B]/60 hover:text-[#4A2B1B]"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="p-4">
            <div className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.label}
                  onClick={() => {
                    setActiveTab(tab.label);
                    setIsMenuOpen(false);
                  }}
                  className={`w-full p-4 text-center font-lobster text-lg rounded-lg
                    ${activeTab === tab.label
                      ? 'text-[#4A2B1B] bg-[#4A2B1B]/5'
                      : 'text-[#4A2B1B]/60 hover:text-[#4A2B1B] hover:bg-[#4A2B1B]/5'
                    }
                  `}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Desktop Tabs */}
      <div className="hidden lg:block border-b border-[#4A2B1B]/10">
        <div className="flex space-x-8 px-4">
          {tabs.map((tab) => (
            <button
              key={tab.label}
              onClick={() => setActiveTab(tab.label)}
              className="group relative py-4 px-1"
            >
              <span className={`font-lobster text-lg whitespace-nowrap
                ${activeTab === tab.label
                  ? 'text-[#4A2B1B]'
                  : 'text-[#4A2B1B]/60 group-hover:text-[#4A2B1B]/80'
                }
              `}>
                {tab.label}
              </span>
              {activeTab === tab.label && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#4A2B1B]" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="lg:mt-8">
        <div className="mt-16 lg:mt-0">
          {tabs.find((tab) => tab.label === activeTab)?.content}
        </div>
      </div>
    </div>
  );
} 