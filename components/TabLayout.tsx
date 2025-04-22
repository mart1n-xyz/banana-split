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
    <div className="w-full min-h-screen bg-[#008080]">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-10 bg-[#C0C0C0] border-2 border-t-[#FFFFFF] border-l-[#FFFFFF] border-r-[#808080] border-b-[#808080]">
        <div className="flex items-center justify-between h-16 px-4">
          <span className="text-xl font-['Press_Start_2P'] text-[#000080]">{activeTab}</span>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="w-10 h-10 flex items-center justify-center text-[#000080] hover:bg-[#000080] hover:text-white"
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
        <div className="lg:hidden fixed inset-0 z-20 bg-[#C0C0C0] border-2 border-t-[#FFFFFF] border-l-[#FFFFFF] border-r-[#808080] border-b-[#808080]">
          <div className="h-16 flex items-center justify-between px-4 border-b-2 border-t-[#808080] border-l-[#808080] border-r-[#FFFFFF] border-b-[#FFFFFF]">
            <span className="text-xl font-['Press_Start_2P'] text-[#000080]">Menu</span>
            <button
              onClick={() => setIsMenuOpen(false)}
              className="w-10 h-10 flex items-center justify-center text-[#000080] hover:bg-[#000080] hover:text-white"
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
                  className={`w-full p-4 text-center font-['Press_Start_2P'] text-sm rounded-none
                    border-2 border-t-[#FFFFFF] border-l-[#FFFFFF] border-r-[#808080] border-b-[#808080]
                    active:border-t-[#808080] active:border-l-[#808080] active:border-r-[#FFFFFF] active:border-b-[#FFFFFF]
                    active:translate-x-[2px] active:translate-y-[2px]
                    ${activeTab === tab.label
                      ? 'bg-[#000080] text-white'
                      : 'bg-[#C0C0C0] text-[#000080] hover:bg-[#000080] hover:text-white'
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
      <div className="hidden lg:block">
        <div className="flex justify-center space-x-2 p-2 bg-[#C0C0C0] border-2 border-t-[#FFFFFF] border-l-[#FFFFFF] border-r-[#808080] border-b-[#808080]">
          {tabs.map((tab) => (
            <button
              key={tab.label}
              onClick={() => setActiveTab(tab.label)}
              className={`px-4 py-2 font-['Press_Start_2P'] text-sm
                border-2 border-t-[#FFFFFF] border-l-[#FFFFFF] border-r-[#808080] border-b-[#808080]
                active:border-t-[#808080] active:border-l-[#808080] active:border-r-[#FFFFFF] active:border-b-[#FFFFFF]
                active:translate-x-[2px] active:translate-y-[2px]
                ${activeTab === tab.label
                  ? 'bg-[#000080] text-white'
                  : 'bg-[#C0C0C0] text-[#000080] hover:bg-[#000080] hover:text-white'
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="lg:mt-4 p-4">
        <div className="mt-16 lg:mt-0">
          <div className="bg-[#C0C0C0] p-4 border-2 border-t-[#FFFFFF] border-l-[#FFFFFF] border-r-[#808080] border-b-[#808080]">
            {tabs.find((tab) => tab.label === activeTab)?.content}
          </div>
        </div>
      </div>
    </div>
  );
} 