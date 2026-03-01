'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'en' | 'hi';

// Translation dictionary
const translations: Record<string, Record<Language, string>> = {
  // Navbar
  'nav.home': { en: 'Home', hi: 'होम' },
  'nav.explorer': { en: 'Explorer', hi: 'एक्सप्लोरर' },
  'nav.timeline': { en: 'Timeline', hi: 'समयरेखा' },
  'nav.navigator': { en: 'Life Navigator', hi: 'जीवन मार्गदर्शक' },
  'nav.dashboard': { en: 'Dashboard', hi: 'डैशबोर्ड' },
  'nav.explore_now': { en: 'Explore Now', hi: 'अभी देखें' },
  'nav.brand': { en: 'Constitutional Nexus', hi: 'संवैधानिक नेक्सस' },

  // Hero Section
  'hero.line1': { en: 'THE LAW,', hi: 'कानून,' },
  'hero.line2': { en: 'INTELLIGENTLY', hi: 'बुद्धिमत्ता से' },
  'hero.line3': { en: 'STRUCTURED', hi: 'संरचित' },
  'hero.subtitle': {
    en: 'A structured, intelligent interface to Indian Constitutional Law. Explore rights, amendments, and provisions with clarity.',
    hi: 'भारतीय संवैधानिक कानून का एक संरचित, बुद्धिमान इंटरफ़ेस। अधिकार, संशोधन और प्रावधानों को स्पष्टता से जानें।',
  },
  'hero.explore_articles': { en: 'Explore Articles', hi: 'अनुच्छेद देखें' },
  'hero.learn_more': { en: 'Learn More', hi: 'और जानें' },
  'hero.articles': { en: 'Articles', hi: 'अनुच्छेद' },
  'hero.parts': { en: 'Parts', hi: 'भाग' },
  'hero.amendments': { en: 'Amendments', hi: 'संशोधन' },
  'hero.articles_indexed': { en: 'Articles Indexed', hi: 'अनुक्रमित अनुच्छेद' },

  // Quick Access
  'quick.title': { en: 'Navigate with Purpose', hi: 'उद्देश्य के साथ नेविगेट करें' },
  'quick.subtitle': { en: 'Choose your path to constitutional intelligence', hi: 'संवैधानिक ज्ञान का अपना मार्ग चुनें' },
  'quick.explore': { en: 'Explore', hi: 'खोजें' },
  'quick.explore_desc': { en: 'Search all articles', hi: 'सभी अनुच्छेद खोजें' },
  'quick.navigator': { en: 'Navigator', hi: 'मार्गदर्शक' },
  'quick.navigator_desc': { en: 'Life situations', hi: 'जीवन स्थितियाँ' },
  'quick.timeline': { en: 'Timeline', hi: 'समयरेखा' },
  'quick.timeline_desc': { en: 'Amendment history', hi: 'संशोधन इतिहास' },
  'quick.dashboard': { en: 'Dashboard', hi: 'डैशबोर्ड' },
  'quick.dashboard_desc': { en: 'Your library', hi: 'आपकी लाइब्रेरी' },

  // Featured Section
  'featured.title': { en: 'Fundamental Rights', hi: 'मौलिक अधिकार' },
  'featured.subtitle': {
    en: 'The cornerstone of Indian democracy — your rights, structured and accessible',
    hi: 'भारतीय लोकतंत्र की आधारशिला — आपके अधिकार, संरचित और सुलभ',
  },
  'featured.view_all': { en: 'View All', hi: 'सभी देखें' },
  'featured.articles_suffix': { en: 'Articles →', hi: 'अनुच्छेद →' },

  // Protecting Section
  'protect.title_1': { en: 'PROTECTING EVERY', hi: 'हर' },
  'protect.title_2': { en: 'RIGHT', hi: 'अधिकार' },
  'protect.title_3': { en: 'YOU HOLD', hi: 'की रक्षा' },
  'protect.subtitle': {
    en: 'The Indian Constitution is not a mere collection of legal provisions — it is the soul of our nation, the guardian of our rights, and the foundation of our democracy.',
    hi: 'भारतीय संविधान केवल कानूनी प्रावधानों का संग्रह नहीं है — यह हमारे राष्ट्र की आत्मा, हमारे अधिकारों का रक्षक और हमारे लोकतंत्र की नींव है।',
  },
  'protect.get_started': { en: 'GET STARTED', hi: 'शुरू करें' },

  // Footer
  'footer.name': { en: 'Constitutional Nexus', hi: 'संवैधानिक नेक्सस' },
  'footer.tagline': {
    en: 'The Intelligent Interface to Indian Law · Built with engineering excellence',
    hi: 'भारतीय कानून का बुद्धिमान इंटरफ़ेस · इंजीनियरिंग उत्कृष्टता से निर्मित',
  },

  // Explorer Page
  'explorer.title': { en: 'Constitution Explorer', hi: 'संविधान एक्सप्लोरर' },
  'explorer.subtitle_prefix': { en: 'Browse and search through', hi: 'ब्राउज़ और खोजें' },
  'explorer.subtitle_suffix': { en: 'constitutional articles', hi: 'संवैधानिक अनुच्छेद' },
  'explorer.filters': { en: 'Filters', hi: 'फ़िल्टर' },
  'explorer.clear_all': { en: 'Clear All', hi: 'सभी हटाएं' },
  'explorer.category': { en: 'Category', hi: 'श्रेणी' },
  'explorer.all_categories': { en: 'All Categories', hi: 'सभी श्रेणियाँ' },
  'explorer.part': { en: 'Part', hi: 'भाग' },
  'explorer.all_parts': { en: 'All Parts', hi: 'सभी भाग' },
  'explorer.showing': { en: 'Showing', hi: 'दिखा रहे हैं' },
  'explorer.of': { en: 'of', hi: 'में से' },
  'explorer.articles': { en: 'articles', hi: 'अनुच्छेद' },
  'explorer.page': { en: 'Page', hi: 'पृष्ठ' },
  'explorer.no_articles': { en: 'No articles found', hi: 'कोई अनुच्छेद नहीं मिला' },
  'explorer.try_adjusting': { en: 'Try adjusting your search or filters', hi: 'अपनी खोज या फ़िल्टर बदलें' },
  'explorer.clear_filters': { en: 'Clear Filters', hi: 'फ़िल्टर हटाएं' },
  'explorer.prev': { en: 'Prev', hi: 'पिछला' },
  'explorer.next': { en: 'Next', hi: 'अगला' },
  'explorer.loading': { en: 'Loading articles...', hi: 'अनुच्छेद लोड हो रहे हैं...' },
  'explorer.search_placeholder': { en: 'Search articles, rights, provisions...', hi: 'अनुच्छेद, अधिकार, प्रावधान खोजें...' },

  // Timeline Page
  'timeline.title': { en: 'Amendment Timeline', hi: 'संशोधन समयरेखा' },
  'timeline.subtitle': {
    en: 'The evolution of the Indian Constitution through its landmark amendments',
    hi: 'ऐतिहासिक संशोधनों के माध्यम से भारतीय संविधान का विकास',
  },
  'timeline.note': {
    en: 'The Indian Constitution has been amended',
    hi: 'भारतीय संविधान में',
  },
  'timeline.over_105': { en: 'over 105 times', hi: '105 से अधिक बार' },
  'timeline.note_suffix': {
    en: 'since its adoption. Each amendment reflects the evolving needs of our democracy and the aspirations of its people.',
    hi: 'संशोधन किया गया है। प्रत्येक संशोधन हमारे लोकतंत्र की बदलती जरूरतों और जनता की आकांक्षाओं को दर्शाता है।',
  },
  'timeline.amendment': { en: 'Amendment', hi: 'संशोधन' },
  'timeline.amendment_0_title': { en: 'Constitution Adopted', hi: 'संविधान अंगीकृत' },
  'timeline.amendment_0_desc': {
    en: 'The Constitution of India came into effect on 26 January 1950, making India a sovereign democratic republic.',
    hi: 'भारत का संविधान 26 जनवरी 1950 को लागू हुआ, जिसने भारत को एक संप्रभु लोकतांत्रिक गणराज्य बनाया।',
  },
  'timeline.amendment_1_title': { en: 'First Amendment', hi: 'पहला संशोधन' },
  'timeline.amendment_1_desc': {
    en: 'Right to property modifications, restrictions on freedom of speech in the interest of public order.',
    hi: 'संपत्ति के अधिकार में संशोधन, सार्वजनिक व्यवस्था के हित में अभिव्यक्ति की स्वतंत्रता पर प्रतिबंध।',
  },
  'timeline.amendment_24_title': { en: '24th Amendment', hi: '24वाँ संशोधन' },
  'timeline.amendment_24_desc': {
    en: 'Parliament affirmed its power to amend any part of the Constitution including Fundamental Rights.',
    hi: 'संसद ने मौलिक अधिकारों सहित संविधान के किसी भी भाग में संशोधन करने की अपनी शक्ति की पुष्टि की।',
  },
  'timeline.amendment_42_title': { en: '42nd Amendment', hi: '42वाँ संशोधन' },
  'timeline.amendment_42_desc': {
    en: 'Added "Socialist, Secular, Integrity" to the Preamble; Fundamental Duties introduced under Article 51A.',
    hi: 'प्रस्तावना में "समाजवादी, धर्मनिरपेक्ष, अखंडता" जोड़ा गया; अनुच्छेद 51A के तहत मौलिक कर्तव्य प्रस्तुत किए गए।',
  },
  'timeline.amendment_86_title': { en: '86th Amendment', hi: '86वाँ संशोधन' },
  'timeline.amendment_86_desc': {
    en: 'Made free and compulsory education a fundamental right for children aged 6–14 under Article 21A.',
    hi: 'अनुच्छेद 21A के तहत 6-14 वर्ष के बच्चों के लिए मुफ्त और अनिवार्य शिक्षा को मौलिक अधिकार बनाया।',
  },
  'timeline.amendment_103_title': { en: '103rd Amendment', hi: '103वाँ संशोधन' },
  'timeline.amendment_103_desc': {
    en: 'Provided 10% reservation in government jobs and educational institutions for economically weaker sections.',
    hi: 'आर्थिक रूप से कमजोर वर्गों के लिए सरकारी नौकरियों और शैक्षणिक संस्थानों में 10% आरक्षण का प्रावधान।',
  },

  // Dashboard Page
  'dashboard.title': { en: 'Your Dashboard', hi: 'आपका डैशबोर्ड' },
  'dashboard.subtitle': { en: 'Your personalized constitutional library', hi: 'आपकी व्यक्तिगत संवैधानिक लाइब्रेरी' },
  'dashboard.bookmarked': { en: 'Bookmarked Articles', hi: 'बुकमार्क किए गए अनुच्छेद' },
  'dashboard.no_bookmarks': { en: 'No bookmarked articles yet', hi: 'अभी तक कोई बुकमार्क नहीं' },
  'dashboard.start_exploring': { en: 'Start exploring →', hi: 'खोजना शुरू करें →' },
  'dashboard.recently_viewed': { en: 'Recently Viewed', hi: 'हाल ही में देखे गए' },
  'dashboard.no_recent': { en: 'No recently viewed articles', hi: 'हाल ही में कोई अनुच्छेद नहीं देखा' },
  'dashboard.loading': { en: 'Loading...', hi: 'लोड हो रहा है...' },
  'dashboard.insight_title': { en: 'Daily Constitutional Insight', hi: 'दैनिक संवैधानिक अंतर्दृष्टि' },
  'dashboard.insight_quote': {
    en: '"The Constitution of India is not a mere collection of legal provisions; it is the soul of our nation, the guardian of our rights, and the foundation of our democracy."',
    hi: '"भारत का संविधान केवल कानूनी प्रावधानों का संग्रह नहीं है; यह हमारे राष्ट्र की आत्मा है, हमारे अधिकारों का रक्षक है, और हमारे लोकतंत्र की नींव है।"',
  },
  'dashboard.insight_footer': {
    en: 'Explore fundamental rights to understand your constitutional protections.',
    hi: 'अपनी संवैधानिक सुरक्षा को समझने के लिए मौलिक अधिकारों का अन्वेषण करें।',
  },

  // Navigator Page
  'navigator.title': { en: 'Life Situation Navigator', hi: 'जीवन स्थिति मार्गदर्शक' },
  'navigator.subtitle': {
    en: 'Find relevant constitutional provisions for real-life situations',
    hi: 'वास्तविक जीवन स्थितियों के लिए प्रासंगिक संवैधानिक प्रावधान खोजें',
  },
  'navigator.loading': { en: 'Loading situations...', hi: 'स्थितियाँ लोड हो रही हैं...' },

  // Article Detail Page
  'article.not_found': { en: 'Article Not Found', hi: 'अनुच्छेद नहीं मिला' },
  'article.not_found_desc': { en: "The article you're looking for doesn't exist.", hi: 'आप जो अनुच्छेद खोज रहे हैं वह मौजूद नहीं है।' },
  'article.back': { en: '← Back to Explorer', hi: '← एक्सप्लोरर पर वापस' },
  'article.back_to_explorer': { en: 'Back to Explorer', hi: 'एक्सप्लोरर पर वापस' },
  'article.back_short': { en: 'Back to Explorer', hi: 'एक्सप्लोरर पर वापस' },
  'article.article': { en: 'Article', hi: 'अनुच्छेद' },
  'article.provision': { en: 'Provision', hi: 'प्रावधान' },
  'article.categories': { en: 'Categories', hi: 'श्रेणियाँ' },
  'article.keywords': { en: 'Keywords', hi: 'मुख्य शब्द' },
  'article.details': { en: 'Article Details', hi: 'अनुच्छेद विवरण' },
  'article.part': { en: 'Part', hi: 'भाग' },
  'article.status': { en: 'Status', hi: 'स्थिति' },
  'article.length': { en: 'Length', hi: 'लंबाई' },
  'article.chars': { en: 'chars', hi: 'अक्षर' },
  'article.quick_navigate': { en: 'Quick Navigate', hi: 'त्वरित नेविगेशन' },
  'article.all_articles': { en: 'All Articles', hi: 'सभी अनुच्छेद' },
  'article.life_situations': { en: 'Life Situations', hi: 'जीवन स्थितियाँ' },
  'article.amendment_timeline': { en: 'Amendment Timeline', hi: 'संशोधन समयरेखा' },
  'article.related': { en: 'Related Articles', hi: 'संबंधित अनुच्छेद' },
  'article.read_more': { en: 'Read more', hi: 'और पढ़ें' },
  'article.loading': { en: 'Loading article...', hi: 'अनुच्छेद लोड हो रहा है...' },

  // HeroChart
  'chart.articles_per_part': { en: 'Articles Per Part', hi: 'भाग अनुसार अनुच्छेद' },
  'chart.top_8': { en: 'Top 8', hi: 'शीर्ष 8' },

  // Common
  'loading': { en: 'Loading...', hi: 'लोड हो रहा है...' },
  'common.article': { en: 'Article', hi: 'अनुच्छेद' },
  'common.general': { en: 'General', hi: 'सामान्य' },
};

// Data-driven Hindi translation maps
const partTitleHindi: Record<string, string> = {
  'THE UNION AND ITS TERRITORY': 'संघ और उसका राज्यक्षेत्र',
  'CITIZENSHIP': 'नागरिकता',
  'FUNDAMENTAL RIGHTS': 'मौलिक अधिकार',
  'DIRECTIVE PRINCIPLES OF STATE POLICY': 'राज्य की नीति के निदेशक तत्व',
  'FUNDAMENTAL DUTIES': 'मौलिक कर्तव्य',
  'THE UNION': 'संघ',
  'THE STATES': 'राज्य',
  'THE STATES IN PART B OF THE FIRST SCHEDULE': 'प्रथम अनुसूची के भाग ख के राज्य',
  'THE UNION TERRITORIES': 'संघ राज्यक्षेत्र',
  'THE PANCHAYATS': 'पंचायतें',
  'THE MUNICIPALITIES': 'नगरपालिकाएँ',
  'THE CO-OPERATIVE SOCIETIES': 'सहकारी समितियाँ',
  'THE SCHEDULED AND TRIBAL AREAS': 'अनुसूचित और जनजातीय क्षेत्र',
  'RELATIONS BETWEEN THE UNION AND THE STATES': 'संघ और राज्यों के बीच संबंध',
  'FINANCE, PROPERTY, CONTRACTS AND SUITS': 'वित्त, संपत्ति, संविदाएँ और वाद',
  'TRADE, COMMERCE AND INTERCOURSE WITHIN THE TERRITORY OF INDIA': 'भारत के राज्यक्षेत्र के भीतर व्यापार, वाणिज्य और समागम',
  'SERVICES UNDER THE UNION AND THE STATES': 'संघ और राज्यों के अधीन सेवाएँ',
  'TRIBUNALS': 'अधिकरण',
  'ELECTIONS': 'निर्वाचन',
  'SPECIAL PROVISIONS RELATING TO CERTAIN CLASSES': 'कुछ वर्गों से संबंधित विशेष उपबंध',
  'OFFICIAL LANGUAGE': 'राजभाषा',
  'EMERGENCY PROVISIONS': 'आपात उपबंध',
  'MISCELLANEOUS': 'प्रकीर्ण',
  'AMENDMENT OF THE CONSTITUTION': 'संविधान का संशोधन',
  'TEMPORARY, TRANSITIONAL AND SPECIAL PROVISIONS': 'अस्थायी, संक्रमणकालीन और विशेष उपबंध',
  'SHORT TITLE, COMMENCEMENT, AUTHORITATIVE TEXT IN HINDI AND REPEALS': 'संक्षिप्त नाम, प्रारंभ, हिंदी में प्राधिकृत पाठ और निरसन',
};

const categoryHindi: Record<string, string> = {
  'Union Powers': 'संघ की शक्तियाँ',
  'General': 'सामान्य',
  'State Powers': 'राज्य की शक्तियाँ',
  'Judiciary': 'न्यायपालिका',
  'Fundamental Rights': 'मौलिक अधिकार',
  'Services': 'सेवाएँ',
  'Directive Principles': 'निदेशक तत्व',
  'Finance': 'वित्त',
  'Elections': 'निर्वाचन',
  'Language': 'भाषा',
  'Citizenship': 'नागरिकता',
  'Education': 'शिक्षा',
  'Property': 'संपत्ति',
  'Emergency': 'आपातकाल',
  'Trade': 'व्यापार',
  'Amendment': 'संशोधन',
};

const statusHindi: Record<string, string> = {
  'active': 'सक्रिय',
  'ACTIVE': 'सक्रिय',
  'omitted': 'हटाया गया',
  'OMITTED': 'हटाया गया',
};

const lifeSituationHindi: Record<string, { title: string; description: string }> = {
  'I want to vote': { title: 'मैं वोट देना चाहता हूँ', description: 'मतदान से संबंधित अधिकार और प्रावधान' },
  'I faced discrimination': { title: 'मुझे भेदभाव का सामना करना पड़ा', description: 'भेदभाव के विरुद्ध संरक्षण' },
  'Freedom of speech issue': { title: 'अभिव्यक्ति की स्वतंत्रता का मामला', description: 'अभिव्यक्ति की स्वतंत्रता से संबंधित अधिकार' },
  'Arrested or detained': { title: 'गिरफ्तारी या हिरासत', description: 'गिरफ्तारी और हिरासत के दौरान अधिकार' },
  'Property rights': { title: 'संपत्ति के अधिकार', description: 'संपत्ति अधिग्रहण से संबंधित अनुच्छेद' },
  'Right to education': { title: 'शिक्षा का अधिकार', description: 'शिक्षा से संबंधित अधिकार' },
  'Government job discrimination': { title: 'सरकारी नौकरी में भेदभाव', description: 'लोक नियोजन में समान अवसर' },
  'Religious freedom': { title: 'धार्मिक स्वतंत्रता', description: 'धर्म और उपासना की स्वतंत्रता' },
};

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
  td: (type: 'part' | 'category' | 'status' | 'situation_title' | 'situation_desc', value: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  toggleLanguage: () => {},
  t: (key: string) => key,
  td: (_type: string, value: string) => value,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('language') as Language;
    if (saved === 'en' || saved === 'hi') {
      setLanguage(saved);
    }
  }, []);

  const toggleLanguage = () => {
    const next = language === 'en' ? 'hi' : 'en';
    setLanguage(next);
    localStorage.setItem('language', next);
  };

  const t = (key: string): string => {
    return translations[key]?.[language] || key;
  };

  const td = (type: 'part' | 'category' | 'status' | 'situation_title' | 'situation_desc', value: string): string => {
    if (language === 'en') return value;
    switch (type) {
      case 'part': return partTitleHindi[value] || value;
      case 'category': return categoryHindi[value] || value;
      case 'status': return statusHindi[value] || value;
      case 'situation_title': return lifeSituationHindi[value]?.title || value;
      case 'situation_desc': return lifeSituationHindi[value]?.description || value;
      default: return value;
    }
  };

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t, td }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
