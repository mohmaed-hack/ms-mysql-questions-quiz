# MySQL Questions Bank — Interactive Quiz

موقع اختبار تفاعلي لمادة **Databases Applications — MySQL**، مبني من بنك الأسئلة الأصلي. يعرض الأسئلة باللغة الإنجليزية فقط، ولا يعرض الإجابات الصحيحة أثناء الاختبار.

## ما الذي يقدمه الموقع؟

- إدخال اسم الطالب قبل بدء الاختبار.
- **918 سؤالاً فريداً** مستخرجاً ومنظماً من ملف بنك الأسئلة الأصلي بعد حذف التكرارات النصية.
- الأنواع: True/False، Multiple Choice، وDirect Question.
- عرض سؤال واحد في كل مرة.
- أزرار Previous وNext.
- الانتقال المباشر بكتابة رقم السؤال أو الضغط على رقم في شبكة التنقل.
- حفظ الإجابات داخل جلسة المتصفح أثناء التنقل.
- زر Finish test لإنهاء الاختبار في أي وقت، حتى مع وجود أسئلة غير مجابة.
- نتيجة من **60** مع عرض Correct وIncorrect وUnanswered ونسبة الإجابة.
- بعد الإنهاء تظهر لوحة **Correction Review** للأسئلة الخاطئة وغير المجابة، وتعرض إجابة الطالب والحل الصحيح.
- علامة النجاح المعتمدة في الموقع: **36 / 60**.
- التذييل: **Eng M_saeed**.

> ملاحظة: أسئلة Direct Question يتم تصحيحها آلياً بطريقة مطابقة كلمات مفتاحية من الإجابة المرجعية الموجودة في بنك الأسئلة. هذا مناسب للمراجعة الذاتية، لكنه ليس بديلاً عن تصحيح المدرس للإجابة المقالية الطويلة.

## التشغيل على الكمبيوتر

### الطريقة الموصى بها باستخدام pnpm

1. فك ضغط الملف `mysqlquiz.zip`.
2. افتح Terminal أو PowerShell داخل مجلد المشروع:

```bash
cd mysqlquiz
```

3. ثبّت Node.js إصدار 18 أو أحدث من: https://nodejs.org/
4. ثبّت pnpm إذا لم يكن موجوداً:

```bash
npm install -g pnpm
```

5. ثبّت الحزم:

```bash
pnpm install
```

6. شغّل الموقع:

```bash
pnpm dev
```

7. افتح الرابط الذي يظهر في الطرفية، وغالباً:

```text
http://localhost:3000
```

8. لإيقاف الموقع اضغط `Ctrl + C`.

### باستخدام npm بدلاً من pnpm

```bash
npm install
npm run dev
```

## إنشاء نسخة الإنتاج محلياً

```bash
pnpm build
pnpm preview
```

سيتم إنشاء مجلد `dist/`، وهو مجلد النشر النهائي.

## رفع المشروع إلى GitHub

### من خلال GitHub Website

1. افتح https://github.com/ وسجّل الدخول.
2. اضغط **New repository**.
3. اكتب اسماً مثل `mysql-questions-quiz`.
4. اختر Public إذا أردت مشاركة الموقع مع الجميع.
5. لا تضف README من GitHub لأن المشروع يحتوي على README بالفعل.
6. اضغط **Create repository**.
7. افتح Terminal داخل مجلد المشروع ونفّذ:

```bash
git init
git add .
git commit -m "Initial MySQL quiz website"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/mysql-questions-quiz.git
git push -u origin main
```

استبدل `YOUR-USERNAME` باسم حسابك في GitHub.

### عند تحديث الأسئلة أو التصميم لاحقاً

```bash
git add .
git commit -m "Update quiz"
git push
```

## نشر الموقع على Vercel

### الطريقة الأسهل: من موقع Vercel

1. افتح https://vercel.com/ وسجّل الدخول بحساب GitHub.
2. اضغط **Add New → Project**.
3. اختر مستودع `mysql-questions-quiz`.
4. اترك الإعدادات كما هي؛ المشروع يستخدم Vite.
5. اضغط **Deploy**.
6. بعد انتهاء البناء سيظهر رابط عام مثل:

```text
https://mysql-questions-quiz.vercel.app
```

### الإعدادات اليدوية إذا طلبها Vercel

- Framework Preset: `Vite`
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

يوجد ملف `vercel.json` داخل المشروع بهذه الإعدادات مسبقاً.

### النشر باستخدام Vercel CLI

```bash
npm install -g vercel
vercel login
vercel
```

وللنشر النهائي:

```bash
vercel --prod
```

## الخصوصية وطريقة التصحيح

الموقع يعمل كواجهة ثابتة ولا يحتاج قاعدة بيانات أو تسجيل دخول. بيانات الطالب وإجاباته تبقى في متصفح الطالب أثناء الجلسة فقط. بعد إنهاء الاختبار تظهر النتيجة وتُحذف جلسة الحفظ المحلية. إذا كان المطلوب امتحاناً رسمياً لا يمكن فحص إجاباته من كود المتصفح، فيجب إضافة Backend وقاعدة بيانات وتصحيح على الخادم.

## الملفات المهمة

- `index.html`: هيكل الصفحات الثلاث: البداية، الاختبار، النتيجة.
- `styles.css`: التصميم المتجاوب.
- `app.js`: منطق الاختبار، التنقل، الحفظ، والتصحيح.
- `src/questions.json`: الأسئلة والبيانات الداخلية للتصحيح.
- `public/manus-routes.json`: ملف مسارات Webdev.
- `vercel.json`: إعداد Vercel.
- `logo.svg`: شعار الموقع.
