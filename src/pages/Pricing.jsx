import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { HiCheck, HiX, HiChevronDown } from 'react-icons/hi'
import PageTransition from '../components/PageTransition'
import PageBanner from '../components/PageBanner'
import { SkeletonGrid } from '../components/Skeleton'
import { useFirestoreCollection } from '../hooks/useFirestoreCollection'

const faqs = [
  { q: 'Can I switch plans later?', a: 'Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.' },
  { q: 'Is there a free trial?', a: 'We offer a 14-day free trial on all products so you can explore features before committing.' },
  { q: 'Do you offer custom pricing?', a: 'Absolutely! For enterprises or specific requirements, contact us for a tailored quote.' },
  { q: 'What payment methods do you accept?', a: 'We accept UPI, debit/credit cards, net banking, and bank transfers for annual plans.' },
  { q: 'Is there a setup fee?', a: 'No setup fees. You only pay for the plan you choose. We also help with onboarding at no extra cost.' },
]

export default function Pricing() {
  const { data: products, loading } = useFirestoreCollection('products', 'order')
  const activeProducts = products.filter(p => p.active !== false && p.pricing)
  const [annual, setAnnual] = useState(false)
  const [openFaq, setOpenFaq] = useState(null)

  return (
    <PageTransition>
      <Helmet>
        <title>Pricing — Hiideals Technologies</title>
        <meta name="description" content="Transparent, affordable pricing for all our software products." />
      </Helmet>

      <PageBanner title="Simple, Transparent Pricing" subtitle="Choose the plan that fits your needs. No hidden fees, no surprises." breadcrumbs={[{ label: 'Pricing' }]} />

      {/* Toggle */}
      <section className="relative py-16 sm:py-24 overflow-hidden" style={{ background: 'linear-gradient(180deg, #0a0f2e, #050816)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="flex items-center justify-center gap-3 mb-12" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            <span className={`text-sm font-medium transition-colors ${!annual ? 'text-white' : 'text-gray-500'}`}>Monthly</span>
            <button onClick={() => setAnnual(!annual)} className="relative w-14 h-7 rounded-full transition-colors" style={{ background: annual ? 'linear-gradient(135deg, #3b82f6, #7c3aed)' : 'rgba(255,255,255,0.1)' }}>
              <span className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-all ${annual ? 'left-8' : 'left-1'}`} />
            </button>
            <span className={`text-sm font-medium transition-colors ${annual ? 'text-white' : 'text-gray-500'}`}>Annual</span>
            {annual && <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold text-emerald-400" style={{ background: 'rgba(52,211,153,0.1)' }}>Save 20%</span>}
          </motion.div>

          {loading ? <SkeletonGrid count={3} /> : activeProducts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500 mb-4">Pricing details coming soon.</p>
              <Link to="/contact" className="text-electric-400 hover:text-electric-300 text-sm font-medium">Contact us for a custom quote &rarr;</Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeProducts.map((product, i) => {
                const plans = product.pricing || []
                return plans.map((plan, pi) => {
                  const monthlyPrice = plan.price || 0
                  const displayPrice = annual ? Math.round(monthlyPrice * 0.8) : monthlyPrice
                  const isPopular = plan.popular || pi === 1

                  return (
                    <motion.div key={`${product.id}-${pi}`}
                      className="relative p-6 rounded-2xl flex flex-col"
                      style={{
                        background: isPopular ? 'linear-gradient(135deg, rgba(59,130,246,0.08), rgba(124,58,237,0.05))' : 'linear-gradient(135deg, rgba(255,255,255,0.03), rgba(255,255,255,0.005))',
                        border: isPopular ? '1px solid rgba(59,130,246,0.2)' : '1px solid rgba(255,255,255,0.05)'
                      }}
                      initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: (i * plans.length + pi) * 0.08 }}
                      whileHover={{ y: -6 }}>
                      {isPopular && (
                        <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] font-bold text-white" style={{ background: 'linear-gradient(135deg, #3b82f6, #7c3aed)' }}>MOST POPULAR</span>
                      )}
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{product.title}</p>
                      <h3 className="text-lg font-bold text-white mb-1">{plan.name || 'Standard'}</h3>
                      <p className="text-sm text-gray-500 mb-4">{plan.description || 'Everything you need to get started.'}</p>
                      <div className="mb-5">
                        <span className="text-3xl font-extrabold text-white">{displayPrice === 0 ? 'Free' : `₹${displayPrice.toLocaleString('en-IN')}`}</span>
                        {displayPrice > 0 && <span className="text-sm text-gray-500">/{annual ? 'year' : 'month'}</span>}
                      </div>
                      <ul className="space-y-2.5 mb-6 flex-1">
                        {(plan.features || []).map((f, fi) => (
                          <li key={fi} className="flex items-start gap-2 text-sm">
                            {f.included !== false ? <HiCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" /> : <HiX className="w-4 h-4 text-gray-600 shrink-0 mt-0.5" />}
                            <span className={f.included !== false ? 'text-gray-300' : 'text-gray-600'}>{f.name || f}</span>
                          </li>
                        ))}
                      </ul>
                      <Link to="/contact" className={`w-full py-3 rounded-xl text-center text-sm font-semibold transition-all hover:-translate-y-0.5 block ${isPopular ? 'text-white' : 'text-white/80 hover:text-white'}`}
                        style={{ background: isPopular ? 'linear-gradient(135deg, #3b82f6, #7c3aed)' : 'rgba(255,255,255,0.06)', border: isPopular ? 'none' : '1px solid rgba(255,255,255,0.08)' }}>
                        {displayPrice === 0 ? 'Get Started' : 'Contact Sales'}
                      </Link>
                    </motion.div>
                  )
                })
              })}
            </div>
          )}
        </div>
      </section>

      {/* Feature Comparison */}
      {activeProducts.length > 0 && activeProducts.some(p => p.pricing?.length > 1) && (
        <section className="py-16" style={{ background: 'linear-gradient(180deg, #050816, #0a0e1a)' }}>
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.h2 className="text-2xl font-bold text-white mb-8 text-center" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>Compare Plans</motion.h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/[0.06]">
                    <th className="py-3 px-4 text-sm font-medium text-gray-500">Feature</th>
                    {activeProducts[0]?.pricing?.map((plan, i) => (
                      <th key={i} className="py-3 px-4 text-sm font-medium text-white text-center">{plan.name || `Plan ${i + 1}`}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(() => {
                    const allFeatures = new Set()
                    activeProducts[0]?.pricing?.forEach(plan => (plan.features || []).forEach(f => allFeatures.add(typeof f === 'string' ? f : f.name)))
                    return [...allFeatures].map((feature, fi) => (
                      <tr key={fi} className="border-b border-white/[0.03]">
                        <td className="py-3 px-4 text-sm text-gray-400">{feature}</td>
                        {activeProducts[0]?.pricing?.map((plan, pi) => {
                          const f = (plan.features || []).find(pf => (typeof pf === 'string' ? pf : pf.name) === feature)
                          const included = f ? (typeof f === 'string' || f.included !== false) : false
                          return (
                            <td key={pi} className="py-3 px-4 text-center">
                              {included ? <HiCheck className="w-4 h-4 text-emerald-400 mx-auto" /> : <HiX className="w-4 h-4 text-gray-600 mx-auto" />}
                            </td>
                          )
                        })}
                      </tr>
                    ))
                  })()}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="py-16 sm:py-24" style={{ background: 'linear-gradient(180deg, #0a0e1a, #050816)' }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2 className="text-2xl font-bold text-white mb-8 text-center" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>Frequently Asked Questions</motion.h2>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <motion.div key={i} className="rounded-xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}
                initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between px-5 py-4 text-left">
                  <span className="text-sm font-medium text-white">{faq.q}</span>
                  <HiChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === i && (
                  <motion.div className="px-5 pb-4" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                    <p className="text-sm text-gray-400">{faq.a}</p>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16" style={{ background: 'linear-gradient(180deg, #050816, #0a0f2e)' }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">Need a Custom Solution?</h2>
            <p className="text-gray-500 mb-6">Let's discuss your requirements and build a plan that works for you.</p>
            <Link to="/contact" className="inline-flex px-8 py-3.5 rounded-xl text-white font-semibold text-sm transition-all hover:-translate-y-0.5"
              style={{ background: 'linear-gradient(135deg, #3b82f6, #7c3aed)', boxShadow: '0 8px 30px rgba(59,130,246,0.2)' }}>
              Contact Our Team
            </Link>
          </motion.div>
        </div>
      </section>
    </PageTransition>
  )
}
