import React from 'react';
import { motion } from 'motion/react';
import { useLanguage } from '../lib/LanguageContext';
import { BookOpen, Upload, User, Shield, Info } from 'lucide-react';

export default function Guide() {
  const { language } = useLanguage();

  const content = {
    my: {
      title: '🌸 Dhamma Library: အသုံးပြုပုံ လမ်းညွှန် (ဓမ္မသင်တန်းသားများအတွက်)',
      intro: 'ဓမ္မစာပေများကို စုဆောင်းမျှဝေခြင်းဖြင့် ကုသိုလ်အတူပြုနိုင်ရန် နွေးထွေးစွာ ကြိုဆိုပါတယ်။ ဤလမ်းညွှန်ချက်သည် ဓမ္မသင်တန်းသားများအတွက် အလွယ်ကူဆုံးဖြစ်အောင် ရေးသားထားပါသည်။',
      sections: [
        {
          icon: <BookOpen className="w-6 h-6 text-zen-orange" />,
          title: 'စာအုပ်များ ဖတ်ရှုခြင်း',
          desc: 'စာကြည့်တိုက်ရှိ စာအုပ်များကို ရှာဖွေပြီး "အီးဘွတ်ဖတ်ရန်" ခလုတ်ကို နှိပ်၍ တိုက်ရိုက်ဖတ်ရှုနိုင်ပါသည်။'
        },
        {
          icon: <Upload className="w-6 h-6 text-zen-orange" />,
          title: 'စာအုပ်များ တင်သွင်းခြင်း',
          desc: 'သင်ပိုင်ဆိုင်သော ဓမ္မစာအုပ်များကို "+ ဓမ္မစာအုပ် တင်ရန်" ခလုတ်မှတစ်ဆင့် အခြားသူများအတွက် မျှဝေနိုင်ပါသည်။'
        },
        {
          icon: <User className="w-6 h-6 text-zen-orange" />,
          title: 'ကိုယ်ရေးအချက်အလက်',
          desc: 'မိမိ၏ အမည်နှင့် လျှို့ဝှက်နံပါတ်များကို "ကိုယ်ရေးအချက်အလက်" စာမျက်နှာတွင် ပြင်ဆင်နိုင်ပါသည်။'
        },
        {
          icon: <Shield className="w-6 h-6 text-zen-orange" />,
          title: 'လုံခြုံရေး',
          desc: 'သင်၏ အကောင့်လုံခြုံရေးအတွက် လျှို့ဝှက်နံပါတ်ကို အခြားသူများအား မပြောပြပါနှင့်။'
        }
      ]
    },
    en: {
      title: '🌸 Dhamma Library: Usage Guide (for Dhamma Students)',
      intro: 'Welcome! We invite you to join us in sharing Dhamma literature. This guide is designed to be as simple as possible for Dhamma students.',
      sections: [
        {
          icon: <BookOpen className="w-6 h-6 text-zen-orange" />,
          title: 'Reading Books',
          desc: 'Search for books in the library and click the "Read E-book" button to read them directly.'
        },
        {
          icon: <Upload className="w-6 h-6 text-zen-orange" />,
          title: 'Uploading Books',
          desc: 'You can share your Dhamma books with others via the "+ Upload Dhamma Ebook" button.'
        },
        {
          icon: <User className="w-6 h-6 text-zen-orange" />,
          title: 'User Profile',
          desc: 'You can update your name and password on the "Profile" page.'
        },
        {
          icon: <Shield className="w-6 h-6 text-zen-orange" />,
          title: 'Security',
          desc: 'For your account security, do not share your password with others.'
        }
      ]
    }
  };

  const activeContent = language === 'my' ? content.my : content.en;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-12"
      >
        <div className="text-center space-y-4">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-zen-green leading-tight">
            {activeContent.title}
          </h1>
          <p className="text-lg text-zen-gray max-w-2xl mx-auto leading-relaxed">
            {activeContent.intro}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {activeContent.sections.map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-8 rounded-3xl shadow-xl border border-zen-gray-light hover:border-zen-orange transition-all group"
            >
              <div className="w-12 h-12 bg-zen-orange/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {section.icon}
              </div>
              <h3 className="text-xl font-serif font-bold text-zen-gray-dark mb-3">{section.title}</h3>
              <p className="text-zen-gray leading-relaxed">{section.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="bg-zen-orange/5 p-8 rounded-3xl border border-zen-orange/20 flex items-start space-x-4">
          <Info className="w-6 h-6 text-zen-orange flex-shrink-0 mt-1" />
          <div className="space-y-2">
            <h4 className="font-bold text-zen-gray-dark">
              {language === 'my' ? 'အကူအညီလိုအပ်ပါသလား?' : 'Need Help?'}
            </h4>
            <p className="text-sm text-zen-gray">
              {language === 'my' 
                ? 'အကယ်၍ အသုံးပြုရခက်ခဲနေပါက စီမံခန့်ခွဲသူထံသို့ ဆက်သွယ်မေးမြန်းနိုင်ပါသည်။' 
                : 'If you find it difficult to use, please contact the administrator.'}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
