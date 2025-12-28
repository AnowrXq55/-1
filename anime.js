const axios = require( axios );
const { exec } = require( child_process );
const fs = require( fs );
const path = require( path );
const webp = require( node-webpmux );
const crypto = require( crypto );

const أساس_أنيمي =  https://api.some-random-api.com/animu ;

function تطبيع_النوع(مدخل) {
    const صغير = (مدخل ||   ).toLowerCase();
    if (صغير ===  facepalm  || صغير ===  face_palm ) return  face-palm ;
    if (صغير ===  quote  || صغير ===  animu-quote  || صغير ===  animuquote ) return  quote ;
    return صغير;
}

async function إرسال_أنيمي(سوك, معرف_الدردشة, رسالة, نوع) {
    const نقطة_الانطلاق = `${أساس_أنيمي}/${نوع}`;
    const استجابة = await axios.get(نقطة_الانطلاق);
    const بيانات = استجابة.data || {};

    // تفضيل الرابط (gif/صورة). إرسال كملصق إذا كان مناسباً؛ الرجوع إلى صورة
    // مساعد لتحويل المخزن المؤقت للوسائط إلى ملصق webp
    async function تحويل_الوسائط_إلى_ملصق(مخزن_وسائط_مؤقت, متحرّك) {
        const مجلد_مؤقت = path.join(process.cwd(),  tmp );
        if (!fs.existsSync(مجلد_مؤقت)) fs.mkdirSync(مجلد_مؤقت, { recursive: true });

        const امتداد_الإدخال = متحرّك ?  gif  :  jpg ;
        const إدخال = path.join(مجلد_مؤقت, `أنيمي_${Date.now()}.${امتداد_الإدخال}`);
        const إخراج = path.join(مجلد_مؤقت, `أنيمي_${Date.now()}.webp`);
        fs.writeFileSync(إدخال, مخزن_وسائط_مؤقت);

        const أمر_اف_إم_بيغ = متحرّك 
            ? `ffmpeg -y -i "${إدخال}" -vf "scale=512:512:force_original_aspect_ratio=decrease,pad=512:512:(ow-iw)/2:(oh-ih)/2:color=#00000000,fps=15" -c:v libwebp -preset default -loop 0 -vsync 0 -pix_fmt yuva420p -quality 60 -compression_level 6 "${إخراج}"`
            : `ffmpeg -y -i "${إدخال}" -vf "scale=512:512:force_original_aspect_ratio=decrease,pad=512:512:(ow-iw)/2:(oh-ih)/2:color=#00000000" -c:v libwebp -preset default -loop 0 -vsync 0 -pix_fmt yuva420p -quality 75 -compression_level 6 "${إخراج}"`;

        await new Promise((حل, رفض) => {
            exec(أمر_اف_إم_بيغ, (خطأ) => (خطأ ? رفض(خطأ) : حل()));
        });

        let مخزن_ويب_مؤقت = fs.readFileSync(إخراج);

        // إضافة بيانات وصفية للملصق
        const صورة = new webp.Image();
        await صورة.load(مخزن_ويب_مؤقت);

        const جيسون = {
             sticker-pack-id : crypto.randomBytes(32).toString( hex ),
             sticker-pack-name :  ملصقات أنيمي ,
             emojis : [ 🎌 ]
        };
        const سمة_اكسيف = Buffer.from([0x49, 0x49, 0x2A, 0x00, 0x08, 0x00, 0x00, 0x00, 0x01, 0x00, 0x41, 0x57, 0x07, 0x00, 0x00, 0x00, 0x00, 0x00, 0x16, 0x00, 0x00, 0x00]);
        const مخزن_جيسون_مؤقت = Buffer.from(JSON.stringify(جيسون),  utf8 );
        const اكسيف = Buffer.concat([سمة_اكسيف, مخزن_جيسون_مؤقت]);
        اكسيف.writeUIntLE(mخزن_جيسون_مؤقت.length, 14, 4);
        صورة.exif = اكسيف;

        const المخزن_المؤقت_النهائي = await صورة.save(null);

        try { fs.unlinkSync(إدخال); } catch {}
        try { fs.unlinkSync(إخراج); } catch {}
        return المخزن_المؤقت_النهائي;
    }

    if (بيانات.link) {
        const رابط = بيانات.link;
        const صغير = رابط.toLowerCase();
        const رابط_جي_آي_إف = صغير.endsWith( .gif );
        const رابط_صورة = صغير.match(/\.(jpg|jpeg|png|webp)$/);

        // تحويل جميع الوسائط (صور GIF والصور) إلى ملصقات
        if (رابط_جي_آي_إف || رابط_صورة) {
            try {
                const استجابة = await axios.get(رابط, {
                    responseType:  arraybuffer ,
                    timeout: 15000,
                    headers: {  User-Agent :  Mozilla/5.0  }
                });
                const مخزن_وسائط_مؤقت = Buffer.from(استجابة.data);
                const مخزن_ملصق_مؤقت = await تحويل_الوسائط_إلى_ملصق(مخزن_وسائط_مؤقت, رابط_جي_آي_إف);
                await سوك.sendMessage(
                    معرف_الدردشة,
                    { sticker: مخزن_ملصق_مؤقت },
                    { quoted: رسالة }
                );
                return;
            } catch (خطأ) {
                console.error( خطأ في تحويل الوسائط إلى ملصق: , خطأ);
            }
        }

        // الرجوع إلى صورة إذا فشل التحويل
        try {
            await سوك.sendMessage(
                معرف_الدردشة,
                { image: { url: رابط }, caption: `أنيمي: ${نوع}` },
                { quoted: رسالة }
            );
            return;
        } catch {}
    }
    if (بيانات.quote) {
        await سوك.sendMessage(
            معرف_الدردشة,
            { text: بيانات.quote },
            { quoted: رسالة }
        );
        return;
    }

    await سوك.sendMessage(
        معرف_الدردشة,
        { text:  ❌ فشل في جلب أنيمي.  },
        { quoted: رسالة }
    );
}

async function أمر_أنيمي(سوك, معرف_الدردشة, رسالة, وسائط) {
    const الأمر_الفرعي = وسائط && وسائط[0] ? وسائط[0] :   ;
    const النوع = تطبيع_النوع(الأمر_الفرعي);

    const المدعوم = [
         nom ,  poke ,  cry ,  kiss ,  pat ,  hug ,  wink ,  face-palm ,  quote 
    ];

    try {
        if (!النوع) {
            // جلب الأنواع المدعومة من API للمساعدة الديناميكية
            try {
                const استجابة = await axios.get(أساس_أنيمي);
                const أنواع_API = استجابة.data && استجابة.data.types ? استجابة.data.types.map(س => س.replace( /animu/ ,   )).join( ,  ) : المدعوم.join( ,  );
                await سوك.sendMessage(معرف_الدردشة, { text: `الاستخدام: .animu <نوع>\nالأنواع: ${أنواع_API}` }, { quoted: رسالة });
            } catch {
                await سوك.sendMessage(معرف_الدردشة, { text: `الاستخدام: .animu <نوع>\nالأنواع: ${المدعوم.join( ,  )}` }, { quoted: رسالة });
            }
            return;
        }

        if (!المدعوم.includes(النوع)) {
            await سوك.sendMessage(معرف_الدردشة, { text: `❌ نوع غير مدعوم: ${النوع}. جرب أحد: ${المدعوم.join( ,  )}` }, { quoted: رسالة });
            return;
        }

        await إرسال_أنيمي(سوك, معرف_الدردشة, رسالة, النوع);
    } catch (خطأ) {
        console.error( خطأ في أمر أنيمي: , خطأ);
        await سوك.sendMessage(معرف_الدردشة, { text:  ❌ حدث خطأ أثناء جلب أنيمي.  }, { quoted: رسالة });
    }
}

module.exports = { أمر_أنيمي };