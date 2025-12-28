const fs = require( fs );

const مسار_منع_المكالمات =  ./data/anticall.json ;

function قراءة_الحالة() {
    try {
        if (!fs.existsSync(مسار_منع_المكالمات)) return { مفعّل: false };
        const خام = fs.readFileSync(مسار_منع_المكالمات,  utf8 );
        const بيانات = JSON.parse(خام ||  {} );
        return { مفعّل: !!بيانات.مفعّل };
    } catch {
        return { مفعّل: false };
    }
}

function كتابة_الحالة(مفعّل) {
    try {
        if (!fs.existsSync( ./data )) fs.mkdirSync( ./data , { recursive: true });
        fs.writeFileSync(مسار_منع_المكالمات, JSON.stringify({ مفعّل: !!مفعّل }, null, 2));
    } catch {}
}

async function أمر_منع_المكالمات(سوك, معرف_الدردشة, رسالة, وسائط) {
    const الحالة = قراءة_الحالة();
    const الأمر_الفرعي = (وسائط ||   ).trim().toLowerCase();

    if (!الأمر_الفرعي || (الأمر_الفرعي !==  on  && الأمر_الفرعي !==  off  && الأمر_الفرعي !==  status )) {
        await سوك.sendMessage(معرف_الدردشة, { text:  *منع المكالمات*\n\n.anticall on  - تمكين الحظر التلقائي للمكالمات الواردة\n.anticall off - تعطيل منع المكالمات\n.anticall status - عرض الحالة الحالية  }, { quoted: رسالة });
        return;
    }

    if (الأمر_الفرعي ===  status ) {
        await سوك.sendMessage(معرف_الدردشة, { text: `منع المكالمات حالياً *${الحالة.مفعّل ?  مفعّل  :  معطل }*.` }, { quoted: رسالة });
        return;
    }

    const التمكين = الأمر_الفرعي ===  on ;
    كتابة_الحالة(التمكين);
    await سوك.sendMessage(معرف_الدردشة, { text: `منع المكالمات الآن *${التمكين ?  مفعّل  :  معطل }*.` }, { quoted: رسالة });
}

module.exports = { أمر_منع_المكالمات, قراءة_الحالة };