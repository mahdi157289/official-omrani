'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FAQ {
  question: Record<string, string>;
  answer: Record<string, string>;
}

const faqs: FAQ[] = [
  {
    question: {
      ar: 'كيف يمكنني الطلب؟',
      fr: 'Comment puis-je commander?',
      en: 'How can I place an order?',
    },
    answer: {
      ar: 'يمكنك الطلب مباشرة من خلال موقعنا الإلكتروني. اختر المنتجات التي تريدها، أضفها إلى السلة، ثم أكمل عملية الدفع.',
      fr: 'Vous pouvez commander directement sur notre site web. Choisissez les produits que vous souhaitez, ajoutez-les au panier, puis complétez le processus de paiement.',
      en: 'You can order directly through our website. Choose the products you want, add them to your cart, then complete the checkout process.',
    },
  },
  {
    question: {
      ar: 'ما هي طرق الدفع المتاحة؟',
      fr: 'Quels sont les modes de paiement disponibles?',
      en: 'What payment methods are available?',
    },
    answer: {
      ar: 'نقبل الدفع عند الاستلام (COD) في الوقت الحالي. سنضيف المزيد من طرق الدفع قريباً.',
      fr: 'Nous acceptons actuellement le paiement à la livraison (COD). Nous ajouterons plus de méthodes de paiement bientôt.',
      en: 'We currently accept cash on delivery (COD). We will add more payment methods soon.',
    },
  },
  {
    question: {
      ar: 'كم يستغرق التوصيل؟',
      fr: 'Combien de temps prend la livraison?',
      en: 'How long does delivery take?',
    },
    answer: {
      ar: 'التوصيل يستغرق عادة من 2 إلى 5 أيام عمل حسب موقعك. يمكنك اختيار الاستلام من القيروان أو تونس لتسريع العملية.',
      fr: 'La livraison prend généralement 2 à 5 jours ouvrables selon votre emplacement. Vous pouvez choisir de récupérer à Kairouan ou Tunis pour accélérer le processus.',
      en: 'Delivery usually takes 2 to 5 business days depending on your location. You can choose to pick up from Kairouan or Tunis to speed up the process.',
    },
  },
  {
    question: {
      ar: 'هل يمكنني إلغاء طلبي؟',
      fr: 'Puis-je annuler ma commande?',
      en: 'Can I cancel my order?',
    },
    answer: {
      ar: 'نعم، يمكنك إلغاء طلبك قبل تأكيده. بعد التأكيد، يرجى الاتصال بنا مباشرة.',
      fr: 'Oui, vous pouvez annuler votre commande avant confirmation. Après confirmation, veuillez nous contacter directement.',
      en: 'Yes, you can cancel your order before confirmation. After confirmation, please contact us directly.',
    },
  },
  {
    question: {
      ar: 'هل المنتجات طازجة؟',
      fr: 'Les produits sont-ils frais?',
      en: 'Are the products fresh?',
    },
    answer: {
      ar: 'نعم، جميع منتجاتنا تُحضر طازجة يومياً باستخدام المكونات الطبيعية والطرق التقليدية.',
      fr: 'Oui, tous nos produits sont préparés frais quotidiennement en utilisant des ingrédients naturels et des méthodes traditionnelles.',
      en: 'Yes, all our products are prepared fresh daily using natural ingredients and traditional methods.',
    },
  },
  {
    question: {
      ar: 'هل تقدمون توصيل مجاني؟',
      fr: 'Offrez-vous la livraison gratuite?',
      en: 'Do you offer free delivery?',
    },
    answer: {
      ar: 'التوصيل مجاني للطلبات التي تزيد عن 50 دينار. للطلبات الأصغر، توجد رسوم توصيل رمزية.',
      fr: 'La livraison est gratuite pour les commandes supérieures à 50 dinars. Pour les commandes plus petites, des frais de livraison symboliques s\'appliquent.',
      en: 'Delivery is free for orders over 50 dinars. For smaller orders, a small delivery fee applies.',
    },
  },
];

export function FAQList({ locale }: { locale: string }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      {faqs.map((faq, index) => (
        <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
          <button
            onClick={() => toggleFAQ(index)}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <span className="font-semibold text-left flex-1">
              {faq.question[locale] || faq.question.en}
            </span>
            {openIndex === index ? (
              <ChevronUp className="w-5 h-5 text-primary flex-shrink-0" />
            ) : (
              <ChevronDown className="w-5 h-5 text-primary flex-shrink-0" />
            )}
          </button>
          {openIndex === index && (
            <div className="px-6 py-4 border-t bg-gray-50">
              <p className="text-text-secondary leading-relaxed">
                {faq.answer[locale] || faq.answer.en}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}





