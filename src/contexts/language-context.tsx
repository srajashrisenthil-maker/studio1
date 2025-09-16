"use client";

import { translateText } from "@/ai/flows/translate-text";
import React, { createContext, useState, useEffect, ReactNode, useCallback } from "react";

type Language = 'en' | 'ta';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  getTranslation: (key: string) => string;
}

export const LanguageContext = createContext<LanguageContextType | null>(null);

const translations: Record<string, Record<Language, string>> = {
  'loading': { en: 'Loading...', ta: 'ஏற்றுகிறது...' },
  'home-tagline': { en: 'Bridging the gap between farm and market', ta: 'பண்ணைக்கும் சந்தைக்கும் உள்ள இடைவெளியைக் குறைத்தல்' },
  'home-for-farmers-title': { en: 'For Farmers', ta: 'விவசாயிகளுக்கு' },
  'home-for-farmers-description': { en: 'Sell your produce directly to marketmen. Get fair prices with AI-powered predictions.', ta: 'உங்கள் விளைபொருட்களை சந்தையிலுள்ளவர்களுக்கு நேரடியாக விற்கவும். AI-இயங்கும் கணிப்புகள் மூலம் நியாயமான விலைகளைப் பெறுங்கள்.' },
  'home-enter-as-farmer': { en: 'Enter as a Farmer', ta: 'விவசாயியாக உள்நுழைக' },
  'home-for-marketmen-title': { en: 'For Marketmen', ta: 'சந்தையிலுள்ளவர்களுக்கு' },
  'home-for-marketmen-description': { en: 'Discover fresh produce and get smart recommendations based on your purchase history.', ta: 'புதிய விளைபொருட்களைக் கண்டறியுங்கள் மற்றும் உங்கள் கொள்முதல் வரலாற்றின் அடிப்படையில் έξυπнான பரிந்துரைகளைப் பெறுங்கள்.' },
  'home-enter-as-marketman': { en: 'Enter as a Marketman', ta: 'சந்தையிலுள்ளவராக உள்நுழைக' },
  'home-footer-rights': { en: 'All rights reserved.', ta: 'அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.' },
  'header-language-switcher-label': { en: 'Select Language', ta: 'மொழியைத் தேர்ந்தெடுக்கவும்' },
  'header-logout-button': { en: 'Log out', ta: 'வெளியேறு' },
  'login-farmer-portal': { en: 'Farmer Portal', ta: 'விவசாயி போர்டல்' },
  'login-marketman-portal': { en: 'Marketman Portal', ta: 'சந்தையாளர் போர்டல்' },
  'login-enter-details-prompt': { en: 'Enter your details to access your dashboard', ta: 'உங்கள் டாஷ்போர்டை அணுக உங்கள் விவரங்களை உள்ளிடவும்' },
  'login-farmer-quote': { en: 'This platform has revolutionized the way I sell my produce. Direct access to marketmen and fair pricing is a game changer.', ta: 'இந்த தளம் நான் என் விளைபொருட்களை விற்கும் முறையை புரட்சிகரமாக்கியுள்ளது. சந்தையாளர்களுக்கு நேரடி அணுகல் மற்றும் நியாயமான விலை நிர்ணயம் ஒரு விளையாட்டு மாற்றியாகும்.' },
  'login-farmer-author': { en: 'A Happy Farmer', ta: 'ஒரு மகிழ்ச்சியான விவசாயி' },
  'login-marketman-quote': { en: 'Sourcing fresh produce has never been easier. The quality is top-notch, and the direct connection with farmers is invaluable.', ta: 'புதிய விளைபொருட்களைப் பெறுவது ஒருபோதும் எளிதாக இருந்ததில்லை. தரம் உயர்ந்தது, மற்றும் விவசாயிகளுடன் நேரடித் தொடர்பு விலைமதிப்பற்றது.' },
  'login-marketman-author': { en: 'A Satisfied Marketman', ta: 'ஒரு திருப்தியான சந்தையாளர்' },
  'form-label-full-name': { en: 'Full Name', ta: 'முழு பெயர்' },
  'form-placeholder-full-name': { en: 'e.g. Ram Singh', ta: 'எ.கா. ராம் சிங்' },
  'form-label-phone-number': { en: 'Phone Number', ta: 'தொலைபேசி எண்' },
  'form-placeholder-phone-number': { en: '10-digit mobile number', ta: '10 இலக்க மொபைல் எண்' },
  'form-label-full-address': { en: 'Full Address', ta: 'முழு முகவரி' },
  'form-placeholder-full-address': { en: 'Your full address', ta: 'உங்கள் முழு முகவரி' },
  'form-label-location': { en: 'Location', ta: 'இடம்' },
  'form-button-get-my-location': { en: 'Get My Location', ta: 'எனது இருப்பிடத்தைப் பெறு' },
  'form-button-location-captured': { en: 'Location Captured!', ta: 'இடம் பிடிக்கப்பட்டது!' },
  'form-button-enter-dashboard': { en: 'Enter Dashboard', ta: 'டாஷ்போர்டில் நுழைக' },
  'toast-location-captured-title': { en: 'Location Captured', ta: 'இடம் பிடிக்கப்பட்டது' },
  'toast-location-captured-description': { en: 'Your location has been successfully recorded.', ta: 'உங்கள் இருப்பிடம் வெற்றிகரமாக பதிவு செய்யப்பட்டுள்ளது.' },
  'toast-location-error-title': { en: 'Location Error', ta: 'இருப்பிடப் பிழை' },
  'toast-location-error-description': { en: 'Could not get your location. Please check your browser settings.', ta: 'உங்கள் இருப்பிடத்தைப் பெற முடியவில்லை. உங்கள் உலாவி அமைப்புகளைச் சரிபார்க்கவும்.' },
  'toast-location-required-title': { en: 'Location Required', ta: 'இருப்பிடம் தேவை' },
  'toast-location-required-description': { en: 'Please provide your location before proceeding.', ta: 'தொடர்வதற்கு முன் உங்கள் இருப்பிடத்தை வழங்கவும்.' },
  'farmer-dashboard-welcome': { en: 'Welcome', ta: 'வரவேற்பு' },
  'farmer-dashboard-description': { en: 'Manage your products and view sales.', ta: 'உங்கள் தயாரிப்புகளை நிர்வகிக்கவும் மற்றும் விற்பனையைக் காணவும்.' },
  'farmer-dashboard-add-product': { en: 'Add Product', ta: 'தயாரிப்பைச் சேர்' },
  'marketman-dashboard-welcome': { en: 'Welcome', ta: 'வரவேற்பு' },
  'marketman-dashboard-description': { en: 'Browse fresh produce from local farmers.', ta: 'உள்ளூர் விவசாயிகளிடமிருந்து புதிய விளைபொருட்களை உலாவவும்.' },
  'marketman-dashboard-available-products': { en: 'Available Products', ta: 'கிடைக்கும் பொருட்கள்' },
  'farmer-profile-title': { en: 'Farmer Profile', ta: 'விவசாயி சுயவிவரம்' },
  'farmer-role-label': { en: 'Farmer', ta: 'விவசாயி' },
  'contact-farmer-button': { en: 'Contact Farmer', ta: 'விவசாயியைத் தொடர்பு கொள்ளுங்கள்' },
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('en');
  const [dynamicTranslations, setDynamicTranslations] = useState<Record<string, Record<Language, string>>>({});

  useEffect(() => {
    const storedLang = localStorage.getItem("agrow-lang") as Language | null;
    if (storedLang) {
      setLanguage(storedLang);
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("agrow-lang", lang);
  };
  
  const getTranslation = useCallback((key: string) => {
    const staticTranslation = translations[key];
    if (staticTranslation) {
        return staticTranslation[language] || staticTranslation['en'];
    }

    const dynamicTranslation = dynamicTranslations[key];
    if (dynamicTranslation) {
        return dynamicTranslation[language] || dynamicTranslation['en'];
    }
    
    return key;
  }, [language, dynamicTranslations]);


  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, getTranslation }}>
      {children}
    </LanguageContext.Provider>
  );
};
