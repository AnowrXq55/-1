const fetch = require( node-fetch );
const fs = require( fs );
const { exec } = require( child_process );
const path = require( path );

async function أمر_مزج_الرموز_التعبيرية(سوك, معرف_الدردشة, رسالة) {
    try {
        // الحصول على النص بعد الأمر
        const نص = رسالة.message?.conversation?.trim() || 
                    رسالة.message?.extendedTextMessage?.text?.trim() ||   ;
        
        const وسائط = نص.split(   ).slice(1);
        
        if (!وسائط[0]) {
            await سوك.sendMessage(معرف_الدردشة, { text:  🎴 مثال: .emojimix 😎+🥰  });
            return;
        }

        if (!نص.includes( + )) {
            await سوك.sendMessage(معرف_الدردشة, { 
                text:  ✳️ افصل الرموز التعبيرية بعلامة *+*\n\n📌 مثال: \n*.emojimix* 😎+🥰  
            });
            return;
        }

        let [رمز1, رمز2] = وسائط[0].split( + ).map(ر => ر.trim());

        // استخدام نقطة نهاية Tenor API
        const رابط = `https://tenor.googleapis.com/v2/featured?key=AIzaSyAyimkuYQYF_FXVALexPuGQctUWRURdCYQ&contentfilter=high&media_filter=png_transparent&component=proactive&collection=emoji_kitchen_v5&q=${encodeURIComponent(رمز1)}_${encodeURIComponent(رمز2)}`;

        const استجابة = await fetch(رابط);
        const بيانات = await استجابة.json();

        if (!بيانات.results || بيانات.results.length === 0) {
            await سوك.sendMessage(معرف_الدردشة, { 
                text:  ❌ لا يمكن مزج هذه الرموز التعبيرية! جرب رموزاً مختلفة.  
            });
            return;
        }

        // الحصول على أول رابط نتيجة
        const رابط_الصورة = بيانات.results[0].url;

        // إنشاء مجلد مؤقت إذا لم يكن موجوداً
        const مجلد_مؤقت = path.join(process.cwd(),  tmp );
        if (!fs.existsSync(مجلد_مؤقت)) {
            fs.mkdirSync(مجلد_مؤقت, { recursive: true });
        }

        // إنشاء أسماء ملفات عشوائية مع مسارات محمية
        const ملف_مؤقت = path.join(مجلد_مؤقت, `مؤقت_${Date.now()}.png`).replace(/\\/g,  / );
        const ملف_الإخراج = path.join(مجلد_مؤقت, `ملصق_${Date.now()}.webp`).replace(/\\/g,  / );

        // تحميل وحفظ الصورة
        const استجابة_الصورة = await fetch(رابط_الصورة);
        const مخزن_مؤقت = await استجابة_الصورة.buffer();
        fs.writeFileSync(ملف_مؤقت, مخزن_مؤقت);

        // التحويل إلى WebP باستخدام ffmpeg مع حماية المسار المناسبة
        const أمر_اف_إم_بيغ = `ffmpeg -i "${ملف_مؤقت}" -vf "scale=512:512:force_original_aspect_ratio=decrease,format=rgba,pad=512:512:(ow-iw)/2:(oh-ih)/2:color=#00000000" "${ملف_الإخراج}"`;
        
        await new Promise((حل, رفض) => {
            exec(أمر_اف_إم_بيغ, (خطأ) => {
                if (خطأ) {
                    console.error( خطأ FFmpeg: , خطأ);
                    رفض(خطأ);
                } else {
                    حل();
                }
            });
        });

        // التحقق مما إذا كان ملف الإخراج موجوداً
        if (!fs.existsSync(ملف_الإخراج)) {
            throw new Error( فشل في إنشاء ملف الملصق );
        }

        // قراءة ملف WebP
        const مخزن_الملصق = fs.readFileSync(ملف_الإخراج);

        // إرسال الملصق
        await سوك.sendMessage(معرف_الدردشة, { 
            sticker: مخزن_الملصق 
        }, { quoted: رسالة });

        // تنظيف الملفات المؤقتة
        try {
            fs.unlinkSync(ملف_مؤقت);
            fs.unlinkSync(ملف_الإخراج);
        } catch (خطأ) {
            console.error( خطأ في تنظيف الملفات المؤقتة: , خطأ);
        }

    } catch (خطأ) {
        console.error( خطأ في أمر مزج الرموز التعبيرية: , خطأ);
        await سوك.sendMessage(معرف_الدردشة, { 
            text:  ❌ فشل في مزج الرموز التعبيرية! تأكد من أنك تستخدم رموزاً تعبيرية صالحة.\n\nمثال: .emojimix 😎+🥰  
        });
    }
}

module.exports = أمر_مزج_الرموز_التعبيرية;