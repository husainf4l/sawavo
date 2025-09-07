import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌟 Starting beauty blog seeding...');

  // First, let's create some categories, authors, and tags if they don't exist
  const skinCareCategory = await prisma.blogCategory.upsert({
    where: { slugEn: 'skincare' },
    update: {},
    create: {
      nameEn: 'Skincare',
      nameAr: 'العناية بالبشرة',
      slugEn: 'skincare',
      slugAr: 'العناية-بالبشرة',
      descriptionEn: 'Everything about skincare routines, products, and tips',
      descriptionAr: 'كل ما يتعلق بروتين العناية بالبشرة والمنتجات والنصائح',
      color: '#FF6B9D',
    },
  });

  const makeupCategory = await prisma.blogCategory.upsert({
    where: { slugEn: 'makeup' },
    update: {},
    create: {
      nameEn: 'Makeup',
      nameAr: 'المكياج',
      slugEn: 'makeup',
      slugAr: 'المكياج',
      descriptionEn: 'Makeup tutorials, trends, and product reviews',
      descriptionAr: 'دروس المكياج والاتجاهات ومراجعات المنتجات',
      color: '#C785F7',
    },
  });

  // Check if authors exist first
  let beautyExpert = await prisma.blogAuthor.findFirst({
    where: { email: 'sarah@skinior.com' }
  });
  
  if (!beautyExpert) {
    beautyExpert = await prisma.blogAuthor.create({
      data: {
        nameEn: 'Sarah Ahmed',
        nameAr: 'سارة أحمد',
        email: 'sarah@skinior.com',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400',
        bioEn: 'Certified skincare specialist with 8+ years of experience in beauty and wellness',
        bioAr: 'أخصائية عناية بالبشرة معتمدة مع أكثر من 8 سنوات من الخبرة في الجمال والعافية',
        socialLinks: {
          instagram: '@sarahbeauty',
          twitter: '@sarahskincare',
          linkedin: 'sarah-ahmed-beauty'
        },
      },
    });
  }

  let dermatologist = await prisma.blogAuthor.findFirst({
    where: { email: 'dr.maya@skinior.com' }
  });
  
  if (!dermatologist) {
    dermatologist = await prisma.blogAuthor.create({
      data: {
        nameEn: 'Dr. Maya Hassan',
        nameAr: 'د. مايا حسن',
        email: 'dr.maya@skinior.com',
        avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400',
        bioEn: 'Board-certified dermatologist specializing in anti-aging and acne treatment',
        bioAr: 'طبيبة جلدية معتمدة متخصصة في مكافحة الشيخوخة وعلاج حب الشباب',
        socialLinks: {
          instagram: '@drmayaskin',
          linkedin: 'dr-maya-hassan'
        },
      },
    });
  }

  // Create tags
  const antiAgingTag = await prisma.blogTag.upsert({
    where: { slugEn: 'anti-aging' },
    update: {},
    create: {
      nameEn: 'Anti-Aging',
      nameAr: 'مكافحة الشيخوخة',
      slugEn: 'anti-aging',
      slugAr: 'مكافحة-الشيخوخة',
    },
  });

  const acneTag = await prisma.blogTag.upsert({
    where: { slugEn: 'acne' },
    update: {},
    create: {
      nameEn: 'Acne',
      nameAr: 'حب الشباب',
      slugEn: 'acne',
      slugAr: 'حب-الشباب',
    },
  });

  const moisturizerTag = await prisma.blogTag.upsert({
    where: { slugEn: 'moisturizer' },
    update: {},
    create: {
      nameEn: 'Moisturizer',
      nameAr: 'مرطب',
      slugEn: 'moisturizer',
      slugAr: 'مرطب',
    },
  });

  const sunscreenTag = await prisma.blogTag.upsert({
    where: { slugEn: 'sunscreen' },
    update: {},
    create: {
      nameEn: 'Sunscreen',
      nameAr: 'واقي الشمس',
      slugEn: 'sunscreen',
      slugAr: 'واقي-الشمس',
    },
  });

  // Create 4 beauty blog posts
  const blogPosts = [
    {
      titleEn: 'The Complete Guide to Building an Anti-Aging Skincare Routine in 2025',
      titleAr: 'الدليل الكامل لبناء روتين العناية بالبشرة المضاد للشيخوخة في عام 2025',
      excerptEn: 'Discover the latest anti-aging ingredients and techniques that actually work, backed by science and dermatologist recommendations.',
      excerptAr: 'اكتشف أحدث المكونات والتقنيات المضادة للشيخوخة التي تعمل فعلاً، بدعم من العلم وتوصيات أطباء الجلد.',
      contentEn: `
# The Complete Guide to Building an Anti-Aging Skincare Routine in 2025

As we step into 2025, the skincare industry continues to evolve with groundbreaking ingredients and innovative formulations. Building an effective anti-aging routine doesn't have to be complicated or expensive – it's all about choosing the right products with proven ingredients.

## Understanding Skin Aging

Skin aging occurs due to two main factors:
- **Intrinsic aging**: Natural aging process controlled by genetics
- **Extrinsic aging**: Environmental factors like sun exposure, pollution, and lifestyle choices

## Essential Anti-Aging Ingredients for 2025

### 1. Retinoids
Still the gold standard for anti-aging, retinoids stimulate collagen production and accelerate cell turnover. Start with retinyl palmitate if you're a beginner.

### 2. Vitamin C
A powerful antioxidant that brightens skin and protects against free radical damage. Look for L-ascorbic acid or magnesium ascorbyl phosphate.

### 3. Peptides
These amino acid chains signal skin to produce more collagen. Copper peptides and palmitoyl tripeptide-1 are particularly effective.

### 4. Niacinamide
This form of vitamin B3 improves skin texture, reduces pore appearance, and regulates oil production.

## Your Anti-Aging Routine

### Morning
1. Gentle cleanser
2. Vitamin C serum
3. Moisturizer with SPF 30+
4. Eye cream

### Evening
1. Double cleanse
2. Retinoid product (start 2-3x per week)
3. Peptide serum
4. Night moisturizer
5. Face oil (optional)

## Pro Tips for Success

- Always patch test new products
- Introduce one new product at a time
- Be patient – results take 6-12 weeks
- Never skip sunscreen during the day
- Consider professional treatments like chemical peels

Remember, consistency is key to seeing results. Start slow, be patient, and your skin will thank you!
      `,
      contentAr: `
# الدليل الكامل لبناء روتين العناية بالبشرة المضاد للشيخوخة في عام 2025

مع دخولنا عام 2025، تستمر صناعة العناية بالبشرة في التطور مع مكونات رائدة وتركيبات مبتكرة. بناء روتين فعال مضاد للشيخوخة لا يجب أن يكون معقداً أو مكلفاً - الأمر كله يتعلق باختيار المنتجات المناسبة مع المكونات المثبتة علمياً.

## فهم شيخوخة الجلد

تحدث شيخوخة الجلد بسبب عاملين رئيسيين:
- **الشيخوخة الداخلية**: عملية الشيخوخة الطبيعية التي تتحكم فيها الوراثة
- **الشيخوخة الخارجية**: العوامل البيئية مثل التعرض للشمس والتلوث وخيارات نمط الحياة

## المكونات الأساسية المضادة للشيخوخة لعام 2025

### 1. الريتينويد
لا يزال المعيار الذهبي لمكافحة الشيخوخة، حيث يحفز الريتينويد إنتاج الكولاجين ويسرع تجديد الخلايا.

### 2. فيتامين سي
مضاد أكسدة قوي يضيء البشرة ويحمي من أضرار الجذور الحرة.

### 3. الببتيدات
هذه السلاسل من الأحماض الأمينية تشير للبشرة لإنتاج المزيد من الكولاجين.

### 4. النياسيناميد
هذا الشكل من فيتامين B3 يحسن ملمس البشرة ويقلل من ظهور المسام.

## روتينك المضاد للشيخوخة

### الصباح
1. منظف لطيف
2. سيروم فيتامين سي
3. مرطب مع SPF 30+
4. كريم العين

### المساء
1. تنظيف مزدوج
2. منتج الريتينويد
3. سيروم الببتيد
4. مرطب ليلي
5. زيت الوجه (اختياري)

تذكر، الاتساق هو مفتاح رؤية النتائج!
      `,
      categoryId: skinCareCategory.id,
      authorId: dermatologist.id,
      tags: [antiAgingTag.id, moisturizerTag.id],
      featured: true,
    },
    {
      titleEn: 'How to Clear Acne Naturally: 7 Science-Backed Methods That Work',
      titleAr: 'كيفية علاج حب الشباب طبيعياً: 7 طرق مدعومة علمياً تعمل بفعالية',
      excerptEn: 'Struggling with acne? Learn about natural, gentle methods to clear your skin without harsh chemicals or expensive treatments.',
      excerptAr: 'تعاني من حب الشباب؟ تعلم عن الطرق الطبيعية واللطيفة لتنظيف بشرتك بدون مواد كيميائية قاسية أو علاجات مكلفة.',
      contentEn: `
# How to Clear Acne Naturally: 7 Science-Backed Methods That Work

Acne affects millions of people worldwide, but that doesn't mean you need to resort to harsh chemicals or expensive treatments. These natural, science-backed methods can help clear your skin gently and effectively.

## Understanding Acne

Acne occurs when hair follicles become clogged with oil and dead skin cells. Factors that contribute include:
- Excess oil production
- Bacteria (particularly P. acnes)
- Inflammation
- Hormonal changes
- Diet and lifestyle factors

## 7 Natural Acne-Fighting Methods

### 1. Tea Tree Oil
Studies show tea tree oil can be as effective as benzoyl peroxide but with fewer side effects. Use 5-10% concentration and always dilute.

### 2. Green Tea
Rich in antioxidants and anti-inflammatory compounds. Use cooled green tea as a toner or look for products containing green tea extract.

### 3. Honey and Cinnamon Masks
Both ingredients have antimicrobial properties. Mix 2 tablespoons honey with 1 teaspoon cinnamon for a weekly mask.

### 4. Aloe Vera
Contains salicylic acid and sulfur, both used in acne treatments. Use pure aloe vera gel as a moisturizer.

### 5. Zinc Supplements
Studies show zinc can reduce acne by up to 50%. Recommended dose: 30-40mg daily with food.

### 6. Probiotics
A healthy gut microbiome can improve skin health. Include fermented foods or quality probiotic supplements.

### 7. Stress Management
Chronic stress increases cortisol, worsening acne. Practice meditation, yoga, or regular exercise.

## Daily Natural Acne Routine

### Morning
1. Gentle cleanser with tea tree oil
2. Green tea toner
3. Aloe vera gel
4. Sunscreen (non-comedogenic)

### Evening
1. Oil cleansing with jojoba oil
2. Honey and cinnamon mask (2x weekly)
3. Aloe vera moisturizer

## Lifestyle Tips

- Drink plenty of water
- Eat anti-inflammatory foods
- Change pillowcases frequently
- Avoid touching your face
- Get adequate sleep

## When to See a Professional

If natural methods don't improve your acne after 6-8 weeks, consider consulting a dermatologist. Severe acne may require prescription treatments.

Remember, patience is key – natural methods take time but can provide lasting results without side effects.
      `,
      contentAr: `
# كيفية علاج حب الشباب طبيعياً: 7 طرق مدعومة علمياً تعمل بفعالية

يؤثر حب الشباب على ملايين الأشخاص حول العالم، لكن هذا لا يعني أنك بحاجة للجوء إلى المواد الكيميائية القاسية أو العلاجات المكلفة. هذه الطرق الطبيعية المدعومة علمياً يمكن أن تساعد في تنظيف بشرتك بلطف وفعالية.

## فهم حب الشباب

يحدث حب الشباب عندما تصبح بصيلات الشعر مسدودة بالزيت وخلايا الجلد الميتة. العوامل المساهمة تشمل:
- الإفراط في إنتاج الزيت
- البكتيريا
- الالتهاب
- التغيرات الهرمونية
- عوامل النظام الغذائي ونمط الحياة

## 7 طرق طبيعية لمحاربة حب الشباب

### 1. زيت شجرة الشاي
تظهر الدراسات أن زيت شجرة الشاي يمكن أن يكون فعالاً مثل البنزويل بيروكسايد ولكن مع آثار جانبية أقل.

### 2. الشاي الأخضر
غني بمضادات الأكسدة والمركبات المضادة للالتهابات.

### 3. أقنعة العسل والقرفة
كلا المكونين لهما خصائص مضادة للميكروبات.

### 4. الصبار
يحتوي على حمض الساليسيليك والكبريت المستخدمان في علاجات حب الشباب.

### 5. مكملات الزنك
تظهر الدراسات أن الزنك يمكن أن يقلل حب الشباب بنسبة تصل إلى 50%.

### 6. البروبيوتيك
الميكروبيوم المعوي الصحي يمكن أن يحسن صحة الجلد.

### 7. إدارة التوتر
التوتر المزمن يزيد الكورتيزول، مما يجعل حب الشباب أسوأ.

تذكر، الصبر هو المفتاح - الطرق الطبيعية تحتاج وقت لكنها توفر نتائج دائمة بدون آثار جانبية.
      `,
      categoryId: skinCareCategory.id,
      authorId: beautyExpert.id,
      tags: [acneTag.id],
      featured: false,
    },
    {
      titleEn: 'Sunscreen 101: Why SPF 30 Isn\'t Always Enough in 2025',
      titleAr: 'واقي الشمس 101: لماذا SPF 30 ليس كافياً دائماً في عام 2025',
      excerptEn: 'Think SPF 30 protects you all day? Think again. Learn about the latest sunscreen science and how to protect your skin properly.',
      excerptAr: 'تعتقد أن SPF 30 يحميك طوال اليوم؟ فكر مرة أخرى. تعلم عن أحدث علوم واقي الشمس وكيفية حماية بشرتك بشكل صحيح.',
      contentEn: `
# Sunscreen 101: Why SPF 30 Isn't Always Enough in 2025

With climate change increasing UV intensity and our understanding of sun damage evolving, it's time to rethink our sunscreen strategy. Here's what you need to know about proper sun protection in 2025.

## Understanding SPF

SPF (Sun Protection Factor) measures protection against UVB rays only:
- SPF 15: Blocks 93% of UVB rays
- SPF 30: Blocks 97% of UVB rays  
- SPF 50: Blocks 98% of UVB rays
- SPF 100: Blocks 99% of UVB rays

## Why SPF 30 Might Not Be Enough

### 1. Application Amount
Most people apply only 25% of the recommended amount (2mg/cm²). This dramatically reduces protection.

### 2. UVA Protection
SPF doesn't measure UVA protection, which causes premature aging and can contribute to skin cancer.

### 3. Water/Sweat Resistance
Even "waterproof" sunscreens lose effectiveness after 40-80 minutes in water.

### 4. Environmental Factors
- High altitude increases UV exposure by 4% per 1000 feet
- Snow reflects 80% of UV rays
- Sand reflects 15% of UV rays
- Water reflects 10% of UV rays

## Choosing the Right Sunscreen

### Chemical vs. Physical
- **Chemical**: Absorbs UV rays (avobenzone, octinoxate)
- **Physical**: Reflects UV rays (zinc oxide, titanium dioxide)

### Key Features to Look For
- Broad-spectrum protection (UVA + UVB)
- Water-resistant for 40-80 minutes
- SPF 30-50 for daily use, SPF 50+ for extended outdoor activity

## Proper Application Technique

### Face
- Use 1/4 teaspoon (about the size of a nickel)
- Apply 15-30 minutes before sun exposure
- Don't forget ears, neck, and hairline

### Body
- Use 1 ounce (2 tablespoons) for entire body
- Pay attention to often-missed spots: feet, between toes, back of hands

## The 2025 Sunscreen Protocol

### Daily Routine
1. Apply sunscreen as the last step of your morning routine
2. Reapply every 2 hours, regardless of SPF
3. Use makeup with SPF as additional protection, not primary

### Outdoor Activities
1. Use SPF 50+ broad-spectrum
2. Apply 30 minutes before exposure
3. Reapply every 40-80 minutes when swimming/sweating
4. Seek shade during peak hours (10 AM - 4 PM)

## Beyond Sunscreen

### Additional Protection
- Wide-brimmed hats (4+ inch brim)
- UV-protective clothing (UPF 50+)
- Wraparound sunglasses
- Seek shade when possible

### Antioxidant Support
- Vitamin C serum in the morning
- Foods rich in lycopene and beta-carotene
- Green tea for additional UV protection

## Common Sunscreen Myths Debunked

### Myth: "I don't need sunscreen on cloudy days"
**Truth**: Up to 80% of UV rays penetrate clouds

### Myth: "Makeup with SPF is enough"
**Truth**: Most people don't apply enough makeup to get advertised SPF protection

### Myth: "I have dark skin, so I don't need sunscreen"
**Truth**: All skin types can experience UV damage and skin cancer

## The Bottom Line

SPF 30 can be adequate for daily wear if applied correctly and reapplied regularly. However, for extended outdoor activities, higher SPF (50+) provides better protection. Remember: the best sunscreen is the one you'll use consistently and correctly.

Your future self will thank you for the extra protection!
      `,
      contentAr: `
# واقي الشمس 101: لماذا SPF 30 ليس كافياً دائماً في عام 2025

مع تغير المناخ الذي يزيد من شدة الأشعة فوق البنفسجية وتطور فهمنا لأضرار الشمس، حان الوقت لإعادة التفكير في استراتيجية واقي الشمس. إليك ما تحتاج لمعرفته حول الحماية الصحيحة من الشمس في عام 2025.

## فهم SPF

عامل الحماية من الشمس (SPF) يقيس الحماية ضد أشعة UVB فقط:
- SPF 15: يحجب 93% من أشعة UVB
- SPF 30: يحجب 97% من أشعة UVB
- SPF 50: يحجب 98% من أشعة UVB
- SPF 100: يحجب 99% من أشعة UVB

## لماذا قد لا يكون SPF 30 كافياً

### 1. كمية التطبيق
معظم الناس يطبقون فقط 25% من الكمية الموصى بها، مما يقلل بشكل كبير من الحماية.

### 2. حماية UVA
SPF لا يقيس حماية UVA، التي تسبب الشيخوخة المبكرة ويمكن أن تساهم في سرطان الجلد.

### 3. مقاومة الماء/العرق
حتى واقيات الشمس "المقاومة للماء" تفقد فعاليتها بعد 40-80 دقيقة في الماء.

## اختيار واقي الشمس المناسب

### كيميائي مقابل فيزيائي
- **كيميائي**: يمتص الأشعة فوق البنفسجية
- **فيزيائي**: يعكس الأشعة فوق البنفسجية

### الميزات الرئيسية للبحث عنها
- حماية واسعة الطيف (UVA + UVB)
- مقاوم للماء لمدة 40-80 دقيقة
- SPF 30-50 للاستخدام اليومي، SPF 50+ للأنشطة الخارجية الممتدة

## تقنية التطبيق المناسبة

### الوجه
- استخدم 1/4 ملعقة صغيرة
- طبق قبل 15-30 دقيقة من التعرض للشمس
- لا تنس الأذنين والرقبة وخط الشعر

### الجسم
- استخدم أونصة واحدة للجسم بالكامل
- انتبه للبقع المفقودة غالباً: القدمين، بين أصابع القدم

تذكر: أفضل واقي شمس هو الذي ستستخدمه باستمرار وبشكل صحيح!
      `,
      categoryId: skinCareCategory.id,
      authorId: dermatologist.id,
      tags: [sunscreenTag.id],
      featured: true,
    },
    {
      titleEn: 'The Minimalist Beauty Routine: 5 Products for Glowing Skin',
      titleAr: 'روتين الجمال البسيط: 5 منتجات للحصول على بشرة متوهجة',
      excerptEn: 'Less is more! Discover how to achieve radiant, healthy skin with just 5 carefully chosen products that actually work.',
      excerptAr: 'الأقل هو الأكثر! اكتشف كيفية الحصول على بشرة مشرقة وصحية مع 5 منتجات مختارة بعناية تعمل حقاً.',
      contentEn: `
# The Minimalist Beauty Routine: 5 Products for Glowing Skin

In a world obsessed with 10-step skincare routines, sometimes the best approach is the simplest one. Here's how to achieve glowing, healthy skin with just 5 essential products.

## Why Minimalist Skincare Works

### Benefits of Simplicity
- Less risk of irritation from too many active ingredients
- More cost-effective
- Easier to stick to consistently
- Reduces decision fatigue
- Better for sensitive skin

### Quality Over Quantity
Instead of buying many mediocre products, invest in fewer high-quality ones that deliver real results.

## The Essential 5-Product Routine

### 1. Gentle Cleanser
**Purpose**: Removes dirt, oil, and makeup without stripping skin
**Key ingredients**: Ceramides, hyaluronic acid, or gentle surfactants
**Best for**: All skin types
**How to use**: Massage for 30 seconds, rinse with lukewarm water

### 2. Vitamin C Serum
**Purpose**: Antioxidant protection, brightening, collagen support
**Key ingredients**: L-ascorbic acid, magnesium ascorbyl phosphate
**Best for**: All skin types (start with lower concentrations if sensitive)
**How to use**: Apply to clean skin in the morning

### 3. Moisturizer with Ceramides
**Purpose**: Hydrates and strengthens skin barrier
**Key ingredients**: Ceramides, niacinamide, hyaluronic acid
**Best for**: All skin types
**How to use**: Apply to damp skin morning and evening

### 4. Sunscreen SPF 30+
**Purpose**: UV protection, prevents premature aging
**Key ingredients**: Zinc oxide, titanium dioxide, or chemical filters
**Best for**: Daily use for all skin types
**How to use**: Apply as final morning step, reapply every 2 hours

### 5. Retinol or Retinoid
**Purpose**: Cell turnover, collagen production, anti-aging
**Key ingredients**: Retinol, retinyl palmitate, or prescription tretinoin
**Best for**: Anti-aging concerns (start slowly)
**How to use**: Apply 2-3 nights per week initially, build up tolerance

## Your Minimalist Routine

### Morning (2 minutes)
1. Gentle cleanser
2. Vitamin C serum (wait 5 minutes)
3. Moisturizer
4. Sunscreen

### Evening (3 minutes)
1. Gentle cleanser (double cleanse if wearing makeup)
2. Retinol (3x per week) OR moisturizer only
3. Moisturizer (if using retinol)

## Tips for Success

### Start Slowly
- Introduce one new product every 2 weeks
- Begin retinol with lowest concentration
- Always patch test new products

### Listen to Your Skin
- Adjust frequency based on skin response
- Add hydrating serum if needed
- Scale back if irritation occurs

### Consistency is Key
- Use products daily for best results
- Be patient – improvements take 6-12 weeks
- Don't constantly switch products

## When to Add More Products

Consider expanding your routine only if:
- You have specific concerns not addressed by the basic 5
- Your skin has adapted well to current products
- You've been consistent for at least 3 months

### Possible Additions
- Exfoliating acid (AHA/BHA) for texture issues
- Hydrating serum for very dry skin
- Eye cream for specific eye area concerns
- Face oil for extra nourishment

## Product Recommendations by Budget

### Budget-Friendly ($50-75 total)
- CeraVe Foaming Cleanser
- The Ordinary Vitamin C Suspension
- CeraVe Daily Moisturizing Lotion
- EltaMD UV Clear Sunscreen
- The Ordinary Retinol 0.2%

### Mid-Range ($100-150 total)
- Vanicream Gentle Facial Cleanser
- Skinceuticals CE Ferulic
- Paula's Choice Clinical Ceramide Enriched Firming Moisturizer
- La Roche-Posay Anthelios Sunscreen
- Paula's Choice Clinical 0.3% Retinol

### Luxury ($200+ total)
- Drunk Elephant Beste No. 9 Jelly Cleanser
- Skinceuticals CE Ferulic
- Drunk Elephant Lala Retro Whipped Cream
- EltaMD UV Sport Sunscreen
- Differin Gel (prescription tretinoin alternative)

## Common Mistakes to Avoid

1. **Using too many actives at once** - Start with one active ingredient
2. **Skipping sunscreen** - Non-negotiable for healthy skin
3. **Changing products too frequently** - Give products time to work
4. **Over-cleansing** - Once daily is often enough
5. **Expecting overnight results** - Skincare is a marathon, not a sprint

## The Bottom Line

Great skin doesn't require a complex routine. These 5 products address the fundamentals: cleansing, protection, hydration, and renewal. Focus on consistency, quality ingredients, and patience for the best results.

Remember: the best routine is one you'll actually follow!
      `,
      contentAr: `
# روتين الجمال البسيط: 5 منتجات للحصول على بشرة متوهجة

في عالم مهووس بروتين العناية بالبشرة المكون من 10 خطوات، أحياناً أفضل نهج هو الأبسط. إليك كيفية الحصول على بشرة متوهجة وصحية مع 5 منتجات أساسية فقط.

## لماذا تعمل العناية البسيطة بالبشرة

### فوائد البساطة
- خطر أقل للتهيج من الكثير من المكونات النشطة
- أكثر فعالية من حيث التكلفة
- أسهل للالتزام بها باستمرار
- يقلل من إرهاق اتخاذ القرار
- أفضل للبشرة الحساسة

### الجودة فوق الكمية
بدلاً من شراء العديد من المنتجات المتوسطة، استثمر في عدد أقل من المنتجات عالية الجودة التي تقدم نتائج حقيقية.

## الروتين الأساسي المكون من 5 منتجات

### 1. منظف لطيف
**الغرض**: إزالة الأوساخ والزيت والمكياج دون تجريد البشرة
**المكونات الرئيسية**: السيراميد، حمض الهيالورونيك
**الأفضل لـ**: جميع أنواع البشرة

### 2. سيروم فيتامين سي
**الغرض**: حماية مضادة للأكسدة، تفتيح، دعم الكولاجين
**المكونات الرئيسية**: حمض L-ascorbic
**الأفضل لـ**: جميع أنواع البشرة

### 3. مرطب بالسيراميد
**الغرض**: ترطيب وتقوية حاجز البشرة
**المكونات الرئيسية**: السيراميد، النياسيناميد
**الأفضل لـ**: جميع أنواع البشرة

### 4. واقي شمس SPF 30+
**الغرض**: حماية من الأشعة فوق البنفسجية، منع الشيخوخة المبكرة
**الأفضل لـ**: الاستخدام اليومي لجميع أنواع البشرة

### 5. الريتينول
**الغرض**: تجديد الخلايا، إنتاج الكولاجين، مكافحة الشيخوخة
**الأفضل لـ**: مخاوف مكافحة الشيخوخة

## روتينك البسيط

### الصباح (دقيقتان)
1. منظف لطيف
2. سيروم فيتامين سي
3. مرطب
4. واقي الشمس

### المساء (3 دقائق)
1. منظف لطيف
2. الريتينول (3 مرات في الأسبوع)
3. مرطب

تذكر: أفضل روتين هو الذي ستتبعه فعلاً!
      `,
      categoryId: skinCareCategory.id,
      authorId: beautyExpert.id,
      tags: [moisturizerTag.id],
      featured: false,
    },
  ];

  // Create blog posts
  for (const blogData of blogPosts) {
    const { tags, ...postData } = blogData;
    
    const post = await prisma.blogPost.create({
      data: {
        ...postData,
        slugEn: postData.titleEn.toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-'),
        slugAr: postData.titleAr
          .replace(/[^a-z0-9\u0600-\u06FF\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-'),
        featuredImage: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800',
        images: [
          'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800',
          'https://images.unsplash.com/photo-1598440947619-2c35fc356ef3?w=800',
        ],
        readTimeEn: '8 min read',
        readTimeAr: '8 دقائق قراءة',
        published: true,
        publishedAt: new Date(),
        seoTitleEn: postData.titleEn,
        seoTitleAr: postData.titleAr,
        seoDescriptionEn: postData.excerptEn,
        seoDescriptionAr: postData.excerptAr,
        views: Math.floor(Math.random() * 1000) + 100,
        likes: Math.floor(Math.random() * 50) + 10,
        commentsCount: Math.floor(Math.random() * 20),
      },
    });

    // Add tags to post
    for (const tagId of tags) {
      await prisma.blogPostTag.create({
        data: {
          postId: post.id,
          tagId,
        },
      });
    }

    console.log(`✅ Created blog post: ${post.titleEn}`);
  }

  console.log('🎉 Successfully seeded 4 beauty blog posts!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding blog posts:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
