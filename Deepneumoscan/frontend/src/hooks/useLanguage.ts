// src/hooks/useLanguage.ts
import { useState, useEffect } from 'react'
import en from '../i18n/en.json'
import kn from '../i18n/kn.json'

type TranslationKey = keyof typeof en

export const useLanguage = () => {
  const [lang, setLang] = useState<'en' | 'kn'>(
    (localStorage.getItem('lang') as 'en' | 'kn') || 'en'
  )

  useEffect(() => {
    localStorage.setItem('lang', lang)
  }, [lang])

  const t = (key: TranslationKey, params?: Record<string, string>) => {
    const dict = lang === 'en' ? en : kn
    let str = dict[key] || key
    if (params) {
      Object.keys(params).forEach((p) => {
        str = str.replace(`{{${p}}}`, params[p])
      })
    }
    return str
  }

  return { lang, setLang, t }
}