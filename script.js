'use client'

import { FormEvent, useEffect, useState } from 'react'
import { ArrowRight, Bike, CheckCircle2, Phone } from 'lucide-react'
import { products } from '@/lib/products'

const models = products.map((item) => ({ ...item, price: `${item.price} دج` }))

export default function OrderPage() {
  const [model, setModel] = useState(products[0]?.id || '')
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    const requestedModel = new URLSearchParams(window.location.search).get('model')
    if (requestedModel && models.some((item) => item.id === requestedModel)) setModel(requestedModel)
  }, [])
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState('')

  async function submit() {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)
    const name = String(data.get('name') || '').trim()
    const phone = String(data.get('phone') || '').replace(/[\s-]/g, '')
    const city = String(data.get('city') || '').trim()
    const selectedModel = models.find((item) => item.id === model)

    if (name.length < 2 || !/^(0)(5|6|7)\d{8}$/.test(phone) || city.length < 2) {
      setError('يرجى كتابة الاسم ورقم هاتف جزائري صحيح والولاية.')
      return
    }

    setError('')
    setIsSending(true)

    try {
      const selectedName = selectedModel?.name || model
      const reservationData = {
        id: `WEB-${Date.now()}`,
        client_id: '',
        client_name: name,
        client_phone: phone,
        client_address: city,
        product_id: model,
        product_model: selectedName,
        product_mark: 'Hadi e-Bikes',
        product_range: selectedModel?.range || '',
        product_motor: selectedModel?.motor || '',
        product_color: '',
        product_price: selectedModel?.price || '',
        note: String(data.get('note') || '').trim(),
        date: new Date().toLocaleDateString('fr-DZ'),
        time: new Date().toLocaleTimeString('fr-DZ'),
        name,
        phone,
        city,
        model: selectedName,
        price: selectedModel?.price || '',
      }

      await fetch('https://script.google.com/macros/s/AKfycbzURIkNST_yMIVenK14M-CJ73gmjlS_MuUn3M9J-aI5T4jwUQaqfcg60B5lQVHhUyun/exec', {
        method: 'POST',
        redirect: 'follow',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(reservationData),
      })
      setSubmitted(true)
      form.reset()
    } catch {
      setError('تعذر إرسال الطلب حالياً. يرجى المحاولة مجدداً أو الاتصال بنا مباشرة.')
    } finally {
      setIsSending(false)
    }
  }

  return (
    <main dir="rtl" className="min-h-screen bg-[#f8fcfd] text-[#11243d]">
      <header className="border-b border-[#e9f0f4] bg-white px-5 py-5 md:px-12">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <a href="/" dir="ltr" className="flex items-center gap-2 whitespace-nowrap text-xl font-black"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#bdeefa] text-[#087ca8]"><Bike size={21} /></span> Hadi <span className="text-[#1599c5]">e-Bikes</span></a>
          <a href="/" className="flex items-center gap-2 rounded-full border border-[#d6e8ee] px-4 py-2 text-sm font-bold text-[#087ca8]"><ArrowRight size={16} /> العودة للمتجر</a>
        </div>
      </header>
      <section className="mx-auto max-w-3xl px-5 py-12 md:px-8 md:py-20">
        <div className="mb-8 text-center"><p dir="ltr" className="mb-3 text-xs font-black tracking-widest text-[#1599c5]">Hadi e-Bikes</p><h1 className="text-4xl font-black md:text-5xl">سجّل طلبك</h1><p className="mt-4 leading-8 text-[#667b89]">املأ المعلومات وسنتصل بك لتأكيد الموديل ووقت الاستلام.</p></div>
        {submitted ? <div className="rounded-[2rem] bg-[#11243d] p-8 text-center text-white shadow-xl md:p-12"><CheckCircle2 className="mx-auto text-[#7cdbef]" size={54} /><p className="mt-6 text-sm font-bold text-[#7cdbef]">وصل الطلب</p><h2 className="mt-3 text-2xl font-black">سنتصل بك لتأكيد طلبك.</h2><p className="mt-3 leading-7 text-[#b7cbd4]">جهّز هاتفك، وسيكون الرد خلال أوقات العمل.</p><button onClick={() => setSubmitted(false)} className="mt-8 rounded-full bg-[#7cdbef] px-6 py-3 text-sm font-black text-[#11243d]">طلب آخر</button></div> : <form onSubmit={submit} className="rounded-[2rem] border border-[#e3eef2] bg-white p-6 shadow-sm md:p-9"><div className="grid gap-5 sm:grid-cols-2"><label className="text-sm font-bold">الاسم<input name="name" className="mt-2 w-full rounded-2xl border border-[#dcebf0] px-4 py-3 outline-none transition focus:border-[#1599c5]" placeholder="مثال: أمينة بوزيد" /></label><label className="text-sm font-bold">الهاتف<input name="phone" inputMode="tel" className="mt-2 w-full rounded-2xl border border-[#dcebf0] px-4 py-3 outline-none transition focus:border-[#1599c5]" placeholder="05xxxxxxxx" /></label><label className="text-sm font-bold sm:col-span-2">الولاية<input name="city" className="mt-2 w-full rounded-2xl border border-[#dcebf0] px-4 py-3 outline-none transition focus:border-[#1599c5]" placeholder="مثال: الجزائر" /></label></div><div className="mt-7"><p className="text-sm font-bold">اختر الموديل</p><div className="mt-3 grid gap-3 sm:grid-cols-2">{models.map((item) => <label key={item.id} className={`cursor-pointer rounded-2xl border p-4 transition ${model === item.id ? 'border-[#1599c5] bg-[#effaff]' : 'border-[#e3eef2]'}`}><input type="radio" name="model" value={item.id} checked={model === item.id} onChange={() => setModel(item.id)} className="sr-only" /><span className="flex items-center justify-between"><b>{item.name}</b><span className="text-sm font-bold text-[#1599c5]">{item.price}</span></span><span className="mt-2 block text-xs text-[#8497a1]">مدى {item.range} · محرك {item.motor}</span></label>)}</div></div><label className="mt-6 block text-sm font-bold">ملاحظة <span className="font-normal text-[#8497a1]">(اختياري)<textarea name="note" rows={3} className="mt-2 w-full resize-none rounded-2xl border border-[#dcebf0] px-4 py-3 outline-none focus:border-[#1599c5]" placeholder="أي تفاصيل إضافية؟" /></span></label>{error && <p className="mt-4 rounded-xl bg-[#fff1ef] px-4 py-3 text-sm font-bold text-[#c75f54]" role="alert">{error}</p>}<button type="submit" className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-[#1599c5] px-6 py-4 text-sm font-black text-white transition hover:bg-[#087ca8]">إرسال الطلب <ArrowRight size={17} /></button><a href="tel:0784076823" className="mt-4 flex items-center justify-center gap-2 text-sm font-bold text-[#087ca8]"><Phone size={16} /> للاستفسار: 0784076823</a></form>}
      </section>
    </main>
  )
}
