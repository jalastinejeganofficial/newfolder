// VeritasAI — Internationalization (i18n) System

const I18N = {
  // Supported languages
  SUPPORTED_LANGUAGES: ['en', 'ta', 'hi', 'te', 'ja'],
  
  // Current language (default: English)
  currentLanguage: 'en',

  // Translations database
  translations: {
    en: {
      // UI Elements
      nav: {
        analyze: 'Analyze',
        howItWorks: 'How It Works',
        verdicts: 'Verdicts'
      },
      hero: {
        eyebrow: 'AI-Powered Fact Analysis Engine',
        title1: 'Stop Misinformation',
        title2: 'Before It Spreads',
        description: 'VeritasAI analyzes any text in real time — extracting claims, evaluating credibility, detecting bias, and generating evidence-based corrections with full reasoning transparency.',
        stats: {
          verdictTypes: 'Verdict Types',
          confidenceScore: 'Confidence Score',
          realtime: 'Real-time',
          llmAnalysis: 'LLM Analysis',
          fullReasoning: 'Full Reasoning Trace'
        }
      },
      input: {
        cardTitle: 'Content Analysis',
        cardSubtitle: 'Paste any text, article excerpt, or social post',
        placeholder: 'Paste any text here — news excerpts, social media posts, articles, claims, or statements you\'d like to fact-check…',
        charCount: 'characters',
        clear: 'Clear',
        analyzeNow: 'Analyze Now',
        trySample: 'Try a sample claim'
      },
      loading: {
        analyzing: 'Analyzing content…',
        llmEvaluating: 'LLM is evaluating claims in real time',
        steps: {
          extractingClaims: 'Extracting claims...',
          evaluatingEvidence: 'Evaluating evidence...',
          detectingBias: 'Detecting bias...',
          generatingReport: 'Generating report...'
        }
      },
      error: {
        failed: 'Analysis Failed',
        pleaseEnterText: 'Please enter some text to analyze',
        minCharacters: 'Please enter at least 10 characters',
        analysisFailedMsg: 'Failed to analyze content. Please try again.'
      },
      results: {
        claimAnalysis: 'Claim Analysis',
        analyzed: 'analyzed',
        overallAssessment: 'Overall Assessment',
        exportReport: 'Export Report',
        newAnalysis: 'New Analysis',
        credibility: 'Credibility'
      },
      verdicts: {
        guide: 'Verdict Guide',
        accurateTrue: 'Accurate/True',
        accurateTrueDesc: 'Claim is factually correct and supported by strong evidence',
        partiallyMisleading: 'Partially Misleading',
        partiallyMisleadingDesc: 'Contains partial truth but deceptive, incomplete, or out of context',
        false: 'False',
        falseDesc: 'Claim contradicts well-established facts and evidence',
        unverifiable: 'Unverifiable',
        unverifiableDesc: 'Insufficient evidence exists to confirm or deny the claim'
      },
      claimCard: {
        confidenceLevel: 'Confidence Level',
        detailedAnalysis: 'Detailed Analysis',
        factBasedCorrection: 'Fact-Based Correction',
        evidenceSources: 'Evidence Sources',
        stepByStepReasoning: 'Step-by-Step Reasoning Process',
        detectedBias: 'Detected Bias & Rhetorical Devices',
        noBias: 'No significant bias detected',
        suggestedVisual: 'Suggested Visual Evidence',
        suggested: 'Suggested:',
        searchTerms: 'Search terms:',
        trustedSources: 'Trusted sources:',
        assumptionsMade: 'Assumptions Made in Analysis',
        analysisLimitations: 'Analysis Limitations',
        methodology: 'Methodology:',
        methodologyText: 'This analysis uses AI-powered evidence-based reasoning with structured fact-checking protocols. Confidence scores reflect certainty levels based on available evidence and source credibility.'
      },
      sidebar: {
        howItWorks: 'How It Works',
        steps: {
          input: 'Input',
          inputDesc: 'Paste any text content for analysis',
          extractClaims: 'Extract Claims',
          extractClaimsDesc: 'LLM identifies discrete factual claims',
          evaluate: 'Evaluate',
          evaluateDesc: 'Each claim is analyzed for accuracy, bias, and context',
          report: 'Report',
          reportDesc: 'Structured verdicts, corrections, and reasoning traces'
        },
        history: 'Session History',
        historySubtitle: 'Recent analyses this session',
        historyEmpty: 'No analyses yet. Run your first check above!',
        credibility: 'Credibility',
        claims: 'claim(s)'
      },
      disclaimer: {
        title: 'Important Disclaimer',
        text: 'VeritasAI uses a large language model and does not access live databases or real-time news. Verdicts are AI-generated estimates — not definitive factual rulings. Always cross-reference with primary sources. Confidence scores reflect model certainty, not ground truth.'
      },
      footer: {
        builtWith: 'Built with OpenRouter',
        hackathon: 'Hackathon 2026',
        responsibleAI: 'Responsible AI · Transparent Reasoning · Open Source'
      },
      toast: {
        done: 'Done!',
        sampleLoaded: 'Sample loaded',
        inputCleared: 'Input cleared',
        analysisComplete: 'Analysis complete!',
        historyLoaded: 'History item loaded',
        reportExported: 'Report exported!',
        readyForNew: 'Ready for new analysis'
      },
      confidence: {
        veryHigh: 'Very High Confidence',
        high: 'High Confidence',
        moderate: 'Moderate Confidence',
        low: 'Low Confidence',
        veryLow: 'Very Low Confidence',
        veryHighDesc: 'Strong consensus with multiple credible sources supporting this verdict',
        highDesc: 'Substantial evidence available with minor uncertainties',
        moderateDesc: 'Some evidence exists but notable uncertainties remain',
        lowDesc: 'Limited evidence available with significant uncertainty',
        veryLowDesc: 'Highly speculative with minimal supporting evidence'
      },
      sourceType: {
        news: 'News Organization',
        academic: 'Academic/Research',
        government: 'Government Source',
        factcheck: 'Fact-Checking Organization'
      },
      visitSource: 'Visit Source →'
    },

    ta: { // Tamil
      nav: {
        analyze: 'பகுப்பாய்வு செய்யவும்',
        howItWorks: 'இது எவ்வாறு செயல்படுகிறது',
        verdicts: 'தீர்ப்புகள்'
      },
      hero: {
        eyebrow: 'AI-இயக்கப்பட்ட உண்மை பகுப்பாய்வு பொறி',
        title1: 'தவறான தகவலை நிறுத்துங்கள்',
        title2: 'அது பரவுவதற்கு முன்',
        description: 'VeritasAI எந்த உரையையும் நிகழ் நேரத்தில் பகுப்பாய்வு செய்கிறது - கோரிக்கைகளைப் பிரித்தெடுக்கும், நம்பகத்தன்மையை மதிப்பிடும், சார்புகளைக் கண்டறியும், மற்றும் முழு காரண வெளிப்படைத்தன்மையுடன் ஆதாரங்களின் அடிப்படையில் திருத்தங்களை உருவாக்கும்.',
        stats: {
          verdictTypes: 'தீர்ப்பு வகைகள்',
          confidenceScore: 'நம்பிக்கை மதிப்பெண்',
          realtime: 'நிகழ் நேரம்',
          llmAnalysis: 'LLM பகுப்பாய்வு',
          fullReasoning: 'முழு காரணத் தடம்'
        }
      },
      input: {
        cardTitle: 'உள்ளடக்க பகுப்பாய்வு',
        cardSubtitle: 'எந்த உரை, கட்டுரை பத்தி அல்லது சமூக இடுகையையும் ஒட்டவும்',
        placeholder: 'எந்த உரையையும் இங்கே ஒட்டவும் — செய்தி மேற்கோள்கள், சமூக ஊடக இடுகைகள், கட்டுரைகள், கோரிக்கைகள் அல்லது நீங்கள் உண்மை சரிபார்க்க விரும்பும் அறிக்கைகள்…',
        charCount: 'எழுத்துக்கள்',
        clear: 'அழி',
        analyzeNow: 'இப்போது பகுப்பாய்வு செய்யவும்',
        trySample: 'மாதிரி கோரிக்கையை முயற்சிக்கவும்'
      },
      loading: {
        analyzing: 'உள்ளடக்கத்தை பகுப்பாய்வு செய்கிறது…',
        llmEvaluating: 'LLM நிகழ் நேரத்தில் கோரிக்கைகளை மதிப்பிடுகிறது',
        steps: {
          extractingClaims: 'கோரிக்கைகளைப் பிரித்தெடுக்கிறது...',
          evaluatingEvidence: 'ஆதாரங்களை மதிப்பிடுகிறது...',
          detectingBias: 'சார்புகளைக் கண்டறிகிறது...',
          generatingReport: 'அறிக்கையை உருவாக்குகிறது...'
        }
      },
      error: {
        failed: 'பகுப்பாய்வு தோல்வியடைந்தது',
        pleaseEnterText: 'பகுப்பாய்வு செய்ய எந்த உரையையும் உள்ளிடவும்',
        minCharacters: 'குறைந்தபட்சம் 10 எழுத்துக்களையாவது உள்ளிடவும்',
        analysisFailedMsg: 'உள்ளடக்கத்தை பகுப்பாய்வு செய்ய தோல்வியடைந்தது. மீண்டும் முயற்சிக்கவும்.'
      },
      results: {
        claimAnalysis: 'கோரிக்கை பகுப்பாய்வு',
        analyzed: 'பகுப்பாய்வு செய்யப்பட்டது',
        overallAssessment: 'ஒட்டுமொத்த மதிப்பீடு',
        exportReport: 'அறிக்கையை ஏற்றுமதி செய்யவும்',
        newAnalysis: 'புதிய பகுப்பாய்வு',
        credibility: 'நம்பகத்தன்மை'
      },
      verdicts: {
        guide: 'தீர்ப்பு வழிகாட்டி',
        accurateTrue: 'துல்லியமான/உண்மை',
        accurateTrueDesc: 'கோரிக்கை புறநிலையாக சரியானது மற்றும் வலுவான ஆதாரங்களால் ஆதரிக்கப்படுகிறது',
        partiallyMisleading: 'ஓரளவு தவறான வழிநடத்தல்',
        partiallyMisleadingDesc: 'பகுதி உண்மையைக் கொண்டுள்ளது ஆனால் ஏமாற்றும், முழுமையற்றது அல்லது சூழலுக்கு புறம்பானது',
        false: 'தவறானது',
        falseDesc: 'கோரிக்கை நன்கு நிறுவப்பட்ட உண்மைகள் மற்றும் ஆதாரங்களுக்கு முரணானது',
        unverifiable: 'சரிபார்க்க முடியாதது',
        unverifiableDesc: 'கோரிக்கையை உறுதிப்படுத்தவோ மறுக்கவோ போதுமான ஆதாரங்கள் இல்லை'
      },
      claimCard: {
        confidenceLevel: 'நம்பிக்கை நிலை',
        detailedAnalysis: 'விரிவான பகுப்பாய்வு',
        factBasedCorrection: 'உண்மையை அடிப்படையாகக் கொண்ட திருத்தம்',
        evidenceSources: 'ஆதார மூலங்கள்',
        stepByStepReasoning: 'படிப்படியான காரண செயல்முறை',
        detectedBias: 'கண்டறியப்பட்ட சார்பு & சொற்பிரயோக சாதனங்கள்',
        noBias: 'குறிப்பிடத்தக்க சார்பு கண்டறியப்படவில்லை',
        suggestedVisual: 'பரிந்துரைக்கப்பட்ட காட்சி ஆதாரம்',
        suggested: 'பரிந்துரைக்கப்பட்டது:',
        searchTerms: 'தேடல் சொற்கள்:',
        trustedSources: 'நம்பகமான மூலங்கள்:',
        assumptionsMade: 'பகுப்பாய்வில் செய்யப்பட்ட ஊகங்கள்',
        analysisLimitations: 'பகுப்பாய்வு வரம்புகள்',
        methodology: 'வழிமுறை:',
        methodologyText: 'இந்த பகுப்பாய்வு கட்டமைக்கப்பட்ட உண்மை சரிபார்ப்பு நெறிமுறைகளுடன் AI-இயக்கப்பட்ட ஆதார சார்ந்த காரணத்தைப் பயன்படுத்துகிறது. நம்பிக்கை மதிப்பெண்கள் கிடைக்கக்கூடிய ஆதாரங்கள் மற்றும் மூல நம்பகத்தன்மையின் அடிப்படையில் உறுதிப்பாடு நிலைகளை பிரதிபலிக்கின்றன.'
      },
      sidebar: {
        howItWorks: 'இது எவ்வாறு செயல்படுகிறது',
        steps: {
          input: 'உள்ளீடு',
          inputDesc: 'பகுப்பாய்வுக்கான எந்த உரை உள்ளடக்கத்தையும் ஒட்டவும்',
          extractClaims: 'கோரிக்கைகளைப் பிரித்தெடு',
          extractClaimsDesc: 'LLM தனித்தனி புறநிலை கோரிக்கைகளை அடையாளம் காண்கிறது',
          evaluate: 'மதிப்பீடு செய்யவும்',
          evaluateDesc: 'ஒவ்வொரு கோரிக்கையும் துல்லியம், சார்பு மற்றும் சூழலுக்காக பகுப்பாய்வு செய்யப்படுகிறது',
          report: 'அறிக்கை',
          reportDesc: 'கட்டமைக்கப்பட்ட தீர்ப்புகள், திருத்தங்கள் மற்றும் காரணத் தடங்கள்'
        },
        history: 'அமர்வு வரலாறு',
        historySubtitle: 'இந்த அமர்வின் சமீபத்திய பகுப்பாய்வுகள்',
        historyEmpty: 'இன்னும் பகுப்பாய்வுகள் இல்லை. மேலே உங்கள் முதல் சோதனையை இயக்கவும்!',
        credibility: 'நம்பகத்தன்மை',
        claims: 'கோரிக்கை(கள்)'
      },
      disclaimer: {
        title: 'முக்கியமான பொறுப்புத்துறப்பு',
        text: 'VeritasAI ஒரு பெரிய மொழி மாதிரியைப் பயன்படுத்துகிறது மற்றும் நேரடி தரவுத்தளங்கள் அல்லது நிகழ் நேர செய்திகளை அணுகாது. தீர்ப்புகள் AI-உருவாக்கப்பட்ட மதிப்பீடுகள் — நிச்சயமான புறநிலை தீர்ப்புகள் அல்ல. எப்போதும் முதன்மை மூலங்களுடன் குறுக்கு-குறிப்பு. நம்பிக்கை மதிப்பெண்கள் மாதிரி உறுதிப்பாட்டை பிரதிபலிக்கின்றன, தரை உண்மை அல்ல.'
      },
      footer: {
        builtWith: 'உடன் உருவாக்கப்பட்டது OpenRouter',
        hackathon: 'ஹேக்கத்தான் 2026',
        responsibleAI: 'பொறுப்பான AI · வெளிப்படைத்தன்மையான காரணம் · திறந்த மூலம்'
      },
      toast: {
        done: 'முடிந்தது!',
        sampleLoaded: 'மாதிரி ஏற்றப்பட்டது',
        inputCleared: 'உள்ளீடு அழிக்கப்பட்டது',
        analysisComplete: 'பகுப்பாய்வு முடிந்தது!',
        historyLoaded: 'வரலாறு உருப்படி ஏற்றப்பட்டது',
        reportExported: 'அறிக்கை ஏற்றுமதி செய்யப்பட்டது!',
        readyForNew: 'புதிய பகுப்பாய்வுக்கு தயார்'
      },
      confidence: {
        veryHigh: 'மிக அதிக நம்பிக்கை',
        high: 'அதிக நம்பிக்கை',
        moderate: 'மிதமான நம்பிக்கை',
        low: 'குறைந்த நம்பிக்கை',
        veryLow: 'மிகக் குறைந்த நம்பிக்கை',
        veryHighDesc: 'இந்த தீர்ப்பை ஆதரிக்கும் பல நம்பகமான மூலங்களுடன் வலுவான ஒருங்கிணைப்பு',
        highDesc: 'சிறிய நிச்சயமற்ற தன்மையுடன் குறிப்பிடத்தக்க ஆதாரங்கள் கிடைக்கின்றன',
        moderateDesc: 'சில ஆதாரங்கள் உள்ளன ஆனால் குறிப்பிடத்தக்க நிச்சயமற்ற தன்மை உள்ளது',
        lowDesc: 'குறிப்பிடத்தக்க நிச்சயமற்ற தன்மையுடன் வரம்புடைய ஆதாரங்கள் கிடைக்கின்றன',
        veryLowDesc: 'குறைந்தபட்ச ஆதரிக்கும் ஆதாரங்களுடன் மிகவும் ஊகாசாரம்'
      },
      sourceType: {
        news: 'செய்தி நிறுவனம்',
        academic: 'கல்வி/ஆராய்ச்சி',
        government: 'அரசு மூலம்',
        factcheck: 'உண்மை சரிபார்ப்பு அமைப்பு'
      },
      visitSource: 'மூலத்தைப் பார்வையிடவும் →'
    },

    hi: { // Hindi
      nav: {
        analyze: 'विश्लेषण करें',
        howItWorks: 'यह कैसे काम करता है',
        verdicts: 'निर्णय'
      },
      hero: {
        eyebrow: 'एआई-संचालित तथ्य विश्लेषण इंजन',
        title1: 'गलत जानकारी को रोकें',
        title2: 'इसके फैलने से पहले',
        description: 'VeritasAI किसी भी पाठ का वास्तविक समय में विश्लेषण करता है - दावों को निकालता है, विश्वसनीयता का मूल्यांकन करता है, पूर्वाग्रह का पता लगाता है, और पूर्ण तर्क पारदर्शिता के साथ साक्ष्य-आधारित सुधार उत्पन्न करता है।',
        stats: {
          verdictTypes: 'निर्णय प्रकार',
          confidenceScore: 'विश्वास स्कोर',
          realtime: 'वास्तविक समय',
          llmAnalysis: 'LLM विश्लेषण',
          fullReasoning: 'पूर्ण तर्क ट्रेस'
        }
      },
      input: {
        cardTitle: 'सामग्री विश्लेषण',
        cardSubtitle: 'कोई भी पाठ, लेख अंश या सोशल पोस्ट पेस्ट करें',
        placeholder: 'यहां कोई भी पाठ पेस्ट करें — समाचार उद्धरण, सोशल मीडिया पोस्ट, लेख, दावे या विवरण जिन्हें आप तथ्य-जांच करना चाहते हैं…',
        charCount: 'अक्षर',
        clear: 'साफ़ करें',
        analyzeNow: 'अभी विश्लेषण करें',
        trySample: 'नमूना दावा आज़माएं'
      },
      loading: {
        analyzing: 'सामग्री का विश्लेषण हो रहा है…',
        llmEvaluating: 'LLM वास्तविक समय में दावों का मूल्यांकन कर रहा है',
        steps: {
          extractingClaims: 'दावे निकाले जा रहे हैं...',
          evaluatingEvidence: 'साक्ष्यों का मूल्यांकन हो रहा है...',
          detectingBias: 'पूर्वाग्रह का पता लगाया जा रहा है...',
          generatingReport: 'रिपोर्ट बनाई जा रही है...'
        }
      },
      error: {
        failed: 'विश्लेषण विफल',
        pleaseEnterText: 'विश्लेषण करने के लिए कुछ पाठ दर्ज करें',
        minCharacters: 'कृपया कम से कम 10 अक्षर दर्ज करें',
        analysisFailedMsg: 'सामग्री का विश्लेषण करने में विफल। कृपया पुनः प्रयास करें।'
      },
      results: {
        claimAnalysis: 'दावा विश्लेषण',
        analyzed: 'विश्लेषित',
        overallAssessment: 'समग्र मूल्यांकन',
        exportReport: 'रिपोर्ट निर्यात करें',
        newAnalysis: 'नया विश्लेषण',
        credibility: 'विश्वसनीयता'
      },
      verdicts: {
        guide: 'निर्णय मार्गदर्शिका',
        accurateTrue: 'सटीक/सत्य',
        accurateTrueDesc: 'दावा तथ्यात्मक रूप से सही है और मजबूत साक्ष्यों द्वारा समर्थित है',
        partiallyMisleading: 'आंशिक रूप से भ्रामक',
        partiallyMisleadingDesc: 'आंशिक सत्य शामिल है लेकिन भ्रामक, अधूरा या संदर्भ से बाहर है',
        false: 'गलत',
        falseDesc: 'दावा अच्छी तरह से स्थापित तथ्यों और साक्ष्यों का खंडन करता है',
        unverifiable: 'असत्यापित',
        unverifiableDesc: 'दावे की पुष्टि या इनकार करने के लिए अपर्याप्त साक्ष्य मौजूद हैं'
      },
      claimCard: {
        confidenceLevel: 'विश्वास स्तर',
        detailedAnalysis: 'विस्तृत विश्लेषण',
        factBasedCorrection: 'तथ्य-आधारित सुधार',
        evidenceSources: 'साक्ष्य स्रोत',
        stepByStepReasoning: 'चरण-दर-चरण तर्क प्रक्रिया',
        detectedBias: 'पता लगाया गया पूर्वाग्रह और छलपूर्ण उपकरण',
        noBias: 'कोई महत्वपूर्ण पूर्वाग्रह नहीं मिला',
        suggestedVisual: 'सुझाया गया दृश्य साक्ष्य',
        suggested: 'सुझाया गया:',
        searchTerms: 'खोज शब्द:',
        trustedSources: 'विश्वसनीय स्रोत:',
        assumptionsMade: 'विश्लेषण में की गई धारणाएं',
        analysisLimitations: 'विश्लेषण सीमाएं',
        methodology: 'कार्यप्रणाली:',
        methodologyText: 'यह विश्लेषण संरचित तथ्य-जांच प्रोटोकॉल के साथ एआई-संचालित साक्ष्य-आधारित तर्क का उपयोग करता है। विश्वास स्कोर उपलब्ध साक्ष्यों और स्रोत विश्वसनीयता के आधार पर निश्चितता स्तर को दर्शाते हैं।'
      },
      sidebar: {
        howItWorks: 'यह कैसे काम करता है',
        steps: {
          input: 'इनपुट',
          inputDesc: 'विश्लेषण के लिए कोई भी पाठ सामग्री पेस्ट करें',
          extractClaims: 'दावे निकालें',
          extractClaimsDesc: 'LLM असतत तथ्यात्मक दावों की पहचान करता है',
          evaluate: 'मूल्यांकन करें',
          evaluateDesc: 'प्रत्येक दावे का सटीकता, पूर्वाग्रह और संदर्भ के लिए विश्लेषण किया जाता है',
          report: 'रिपोर्ट',
          reportDesc: 'संरचित निर्णय, सुधार और तर्क ट्रेस'
        },
        history: 'सत्र इतिहास',
        historySubtitle: 'इस सत्र के हाल के विश्लेषण',
        historyEmpty: 'अभी तक कोई विश्लेषण नहीं। ऊपर अपनी पहली जांच चलाएं!',
        credibility: 'विश्वसनीयता',
        claims: 'दावे'
      },
      disclaimer: {
        title: 'महत्वपूर्ण अस्वीकरण',
        text: 'VeritasAI एक बड़ी भाषा मॉडल का उपयोग करता है और लाइव डेटाबेस या वास्तविक समय की खबरों तक नहीं पहुंचता है। निर्णय एआई-जनरेटेड अनुमान हैं — निश्चित तथ्यात्मक शासन नहीं। हमेशा प्राथमिक स्रोतों के साथ क्रॉस-संदर्भ करें। विश्वास स्कोर मॉडल निश्चितता को दर्शाते हैं, न कि जमीनी सच्चाई।'
      },
      footer: {
        builtWith: 'के साथ बनाया गया OpenRouter',
        hackathon: 'हैकाथॉन 2026',
        responsibleAI: 'जिम्मेदार एआई · पारदर्शी तर्क · ओपन सोर्स'
      },
      toast: {
        done: 'पूर्ण!',
        sampleLoaded: 'नमूना लोड किया गया',
        inputCleared: 'इनपुट साफ़ किया गया',
        analysisComplete: 'विश्लेषण पूर्ण!',
        historyLoaded: 'इतिहास आइटम लोड किया गया',
        reportExported: 'रिपोर्ट निर्यात की गई!',
        readyForNew: 'नए विश्लेषण के लिए तैयार'
      },
      confidence: {
        veryHigh: 'बहुत उच्च विश्वास',
        high: 'उच्च विश्वास',
        moderate: 'मध्यम विश्वास',
        low: 'कम विश्वास',
        veryLow: 'बहुत कम विश्वास',
        veryHighDesc: 'इस निर्णय का समर्थन करने वाले कई विश्वसनीय स्रोतों के साथ मजबूत सहमति',
        highDesc: 'मामूली अनिश्चितताओं के साथ पर्याप्त साक्ष्य उपलब्ध',
        moderateDesc: 'कुछ साक्ष्य मौजूद हैं लेकिन उल्लेखनीय अनिश्चितताएं बनी हुई हैं',
        lowDesc: 'महत्वपूर्ण अनिश्चितताओं के साथ सीमित साक्ष्य उपलब्ध',
        veryLowDesc: 'न्यूनतम सहायक साक्ष्यों के साथ अत्यधिक अटकलबाजी'
      },
      sourceType: {
        news: 'समाचार संगठन',
        academic: 'शैक्षणिक/अनुसंधान',
        government: 'सरकारी स्रोत',
        factcheck: 'तथ्य-जांच संगठन'
      },
      visitSource: 'स्रोत पर जाएं →'
    },

    te: { // Telugu
      nav: {
        analyze: 'విశ్లేషించండి',
        howItWorks: 'ఇది ఎలా పనిచేస్తుంది',
        verdicts: 'తీర్పులు'
      },
      hero: {
        eyebrow: 'AI-ప్రవర్తిత వాస్తవ విశ్లేషణ ఇంజిన్',
        title1: 'తప్పు సమాచారాన్ని ఆపండి',
        title2: 'అది వ్యాపించే ముందు',
        description: 'VeritasAI ఏదైనా పాఠ్యాన్ని నిజ సమయంలో విశ్లేషిస్తుంది - వాదనలను సేకరిస్తుంది, నమ్మకత్వాన్ని అంచనా వేస్తుంది, పక్షపాతాలను గుర్తిస్తుంది మరియు పూర్తి కారణ పారదర్శకతతో సాక్ష్య ఆధారిత దిద్దుబాట్లను రూపొందిస్తుంది.',
        stats: {
          verdictTypes: 'తీర్పు రకాలు',
          confidenceScore: 'నమ్మక స్కోర్',
          realtime: 'నిజ సమయం',
          llmAnalysis: 'LLM విశ్లేషణ',
          fullReasoning: 'పూర్తి కారణ ట్రేస్'
        }
      },
      input: {
        cardTitle: 'కంటెంట్ విశ్లేషణ',
        cardSubtitle: 'ఏదైనా పాఠ్యం, వ్యాసం భాగం లేదా సోషల్ పోస్ట్‌ను పెస్ట్ చేయండి',
        placeholder: 'ఇక్కడ ఏదైనా పాఠ్యాన్ని పెస్ట్ చేయండి — వార్తా ఉద్ధరణలు, సోషల్ మీడియా పోస్ట్‌లు, వ్యాసాలు, వాదనలు లేదా మీరు వాస్తవ-తనిఖీ చేయాలనుకునే ప్రకటనలు…',
        charCount: 'అక్షరాలు',
        clear: 'క్లియర్',
        analyzeNow: 'ఇప్పుడు విశ్లేషించండి',
        trySample: 'నమూనా వాదనను ప్రయత్నించండి'
      },
      loading: {
        analyzing: 'కంటెంట్‌ను విశ్లేషిస్తుంది…',
        llmEvaluating: 'LLM నిజ సమయంలో వాదనలను అంచనా వేస్తోంది',
        steps: {
          extractingClaims: 'వాదనలను సేకరిస్తోంది...',
          evaluatingEvidence: 'సాక్ష్యాలను అంచనా వేస్తోంది...',
          detectingBias: 'పక్షపాతాలను గుర్తిస్తోంది...',
          generatingReport: 'నివేదికను రూపొందిస్తోంది...'
        }
      },
      error: {
        failed: 'విశ్లేషణ విఫలమైంది',
        pleaseEnterText: 'విశ్లేషించడానికి కొంత పాఠ్యాన్ని నమోదు చేయండి',
        minCharacters: 'దయచేసి కనీసం 10 అక్షరాలను నమోదు చేయండి',
        analysisFailedMsg: 'కంటెంట్‌ను విశ్లేషించడంలో విఫలమైంది. దయచేసి మళ్లీ ప్రయత్నించండి.'
      },
      results: {
        claimAnalysis: 'వాదన విశ్లేషణ',
        analyzed: 'విశ్లేషించబడింది',
        overallAssessment: 'మొత్తం అంచనా',
        exportReport: 'నివేదికను ఎగుమతి చేయండి',
        newAnalysis: 'కొత్త విశ్లేషణ',
        credibility: 'నమ్మకత్వం'
      },
      verdicts: {
        guide: 'తీర్పు మార్గదర్శకం',
        accurateTrue: 'ఖచ్చితమైన/నిజం',
        accurateTrueDesc: 'వాదన వాస్తవికంగా సరైనది మరియు బలమైన సాక్ష్యాలచే మద్దతు ఇవ్వబడింది',
        partiallyMisleading: 'పాక్షికంగా తప్పుదారి పట్టించే',
        partiallyMisleadingDesc: 'పాక్షిక నిజాన్ని కలిగి ఉంది కానీ మోసపూరితం, అసంపూర్ణం లేదా సందర్భానికి బయట ఉంది',
        false: 'తప్పు',
        falseDesc: 'వాదన బాగా స్థాపించబడిన వాస్తవాలు మరియు సాక్ష్యాలకు విరుద్ధం',
        unverifiable: 'నిర్ధారించలేనిది',
        unverifiableDesc: 'వాదనను నిర్ధారించడానికి లేదా ఖండించడానికి సరిపోని సాక్ష్యాలు ఉన్నాయి'
      },
      claimCard: {
        confidenceLevel: 'నమ్మక స్థాయి',
        detailedAnalysis: 'వివరణాత్మక విశ్లేషణ',
        factBasedCorrection: 'వాస్తవ-ఆధారిత దిద్దుబాటు',
        evidenceSources: 'సాక్ష్య మూలాలు',
        stepByStepReasoning: 'దశలవారీగా కారణ ప్రక్రియ',
        detectedBias: 'గుర్తించబడిన పక్షపాతం మరియు రెటోరికల్ పరికరాలు',
        noBias: 'గమనించదగిన పక్షపాతం కనుగొనబడలేదు',
        suggestedVisual: 'సూచించబడిన దృశ్య సాక్ష్యం',
        suggested: 'సూచించబడింది:',
        searchTerms: 'శోధన పదాలు:',
        trustedSources: 'విశ్వసనీయ మూలాలు:',
        assumptionsMade: 'విశ్లేషణలో చేయబడిన ఊహలు',
        analysisLimitations: 'విశ్లేషణ పరిమితులు',
        methodology: 'పద్ధతి:',
        methodologyText: 'ఈ విశ్లేషణ నిర్మిత వాస్తవ-తనిఖీ ప్రోటోకాల్‌లతో AI-ప్రవర్తిత సాక్ష్య-ఆధారిత కారణాన్ని ఉపయోగిస్తుంది. నమ్మక స్కోర్‌లు అందుబాటులో ఉన్న సాక్ష్యాలు మరియు మూల నమ్మకత్వం ఆధారంగా నిశ్చయ స్థాయిలను ప్రతిబింబిస్తాయి.'
      },
      sidebar: {
        howItWorks: 'ఇది ఎలా పనిచేస్తుంది',
        steps: {
          input: 'ఇన్‌పుట్',
          inputDesc: 'విశ్లేషణ కోసం ఏదైనా పాఠ్య కంటెంట్‌ను పెస్ట్ చేయండి',
          extractClaims: 'వాదనలను సేకరించండి',
          extractClaimsDesc: 'LLM వేర్వేరు వాస్తవిక వాదనలను గుర్తిస్తుంది',
          evaluate: 'మూల్యాంకనం చేయండి',
          evaluateDesc: 'ప్రతి వాదన ఖచ్చితత్వం, పక్షపాతం మరియు సందర్భం కోసం విశ్లేషించబడుతుంది',
          report: 'నివేదిక',
          reportDesc: 'నిర్మిత తీర్పులు, దిద్దుబాట్లు మరియు కారణ ట్రేస్‌లు'
        },
        history: 'సెషన్ చరిత్ర',
        historySubtitle: 'ఈ సెషన్‌లో ఇటీవలి విశ్లేషణలు',
        historyEmpty: 'ఇంకా విశ్లేషణలు లేవు. పైన మీ మొదటి తనిఖీని నడపండి!',
        credibility: 'నమ్మకత్వం',
        claims: 'వాదన(లు)'
      },
      disclaimer: {
        title: 'ముఖ్యమైన నిరాకరణ',
        text: 'VeritasAI ఒక పెద్ద భాషా మోడల్‌ను ఉపయోగిస్తుంది మరియు లైవ్ డేటాబేస్‌లు లేదా నిజ సమయ వార్తలను యాక్సెస్ చేయదు. తీర్పులు AI-ఉత్పత్తి చేయబడిన అంచనాలు - ఖచ్చితమైన వాస్తవిక తీర్పులు కాదు. ఎల్లప్పుడూ ప్రాథమిక మూలాలతో క్రాస్-సందర్భించండి. నమ్మక స్కోర్‌లు మోడల్ నిశ్చయాన్ని ప్రతిబింబిస్తాయి, గ్రౌండ్ నిజం కాదు.'
      },
      footer: {
        builtWith: 'తో నిర్మించబడింది OpenRouter',
        hackathon: 'హ్యాకథాన్ 2026',
        responsibleAI: 'బాధ్యతాయుతమైన AI · పారదర్శక కారణం · ఓపెన్ సోర్స్'
      },
      toast: {
        done: 'పూర్తయింది!',
        sampleLoaded: 'నమూనా లోడ్ చేయబడింది',
        inputCleared: 'ఇన్‌పుట్ క్లియర్ చేయబడింది',
        analysisComplete: 'విశ్లేషణ పూర్తయింది!',
        historyLoaded: 'చరిత్ర అంశం లోడ్ చేయబడింది',
        reportExported: 'నివేదిక ఎగుమతి చేయబడింది!',
        readyForNew: 'కొత్త విశ్లేషణకు సిద్ధంగా ఉంది'
      },
      confidence: {
        veryHigh: 'చాలా ఎక్కువ నమ్మకం',
        high: 'ఎక్కువ నమ్మకం',
        moderate: 'మధ్యస్థ నమ్మకం',
        low: 'తక్కువ నమ్మకం',
        veryLow: 'చాలా తక్కువ నమ్మకం',
        veryHighDesc: 'ఈ తీర్పుకు మద్దతు ఇచ్చే అనేక విశ్వసనీయ మూలాలతో బలమైన ఏకాభిప్రాయం',
        highDesc: 'స్వల్ప అనిశ్చితులతో గణనీయమైన సాక్ష్యాలు అందుబాటులో ఉన్నాయి',
        moderateDesc: 'కొన్ని సాక్ష్యాలు ఉన్నాయి కానీ గమనించదగిన అనిశ్చితులు ఉన్నాయి',
        lowDesc: 'గణనీయమైన అనిశ్చితులతో పరిమిత సాక్ష్యాలు అందుబాటులో ఉన్నాయి',
        veryLowDesc: 'కనీస మద్దతు సాక్ష్యాలతో చాలా ఊహాజనిత'
      },
      sourceType: {
        news: 'వార్తా సంస్థ',
        academic: 'ఆకాడమిక్/పరిశోధన',
        government: 'ప్రభుత్వ మూలం',
        factcheck: 'వాస్తవ-తనిఖీ సంస్థ'
      },
      visitSource: 'మూలాన్ని సందర్శించండి →'
    },

    ja: { // Japanese
      nav: {
        analyze: '分析する',
        howItWorks: '仕組み',
        verdicts: '判定'
      },
      hero: {
        eyebrow: 'AI 搭載事実分析エンジン',
        title1: '誤情報を食い止める',
        title2: '拡散する前に',
        description: 'VeritasAI は、あらゆるテキストをリアルタイムで分析します。主張を抽出し、信頼性を評価し、バイアスを検出し、完全な推論の透明性を持って証拠に基づく修正を生成します。',
        stats: {
          verdictTypes: '判定タイプ',
          confidenceScore: '信頼度スコア',
          realtime: 'リアルタイム',
          llmAnalysis: 'LLM 分析',
          fullReasoning: '完全な推論トレース'
        }
      },
      input: {
        cardTitle: 'コンテンツ分析',
        cardSubtitle: 'テキスト、記事の抜粋、またはソーシャル投稿を貼り付けてください',
        placeholder: 'ここにテキストを貼り付けてください — ニュース引用、ソーシャルメディア投稿、記事、主張、またはファクトチェックしたいステートメント…',
        charCount: '文字',
        clear: 'クリア',
        analyzeNow: '今すぐ分析',
        trySample: 'サンプル主張を試す'
      },
      loading: {
        analyzing: 'コンテンツを分析中…',
        llmEvaluating: 'LLM がリアルタイムで主張を評価中',
        steps: {
          extractingClaims: '主張を抽出中...',
          evaluatingEvidence: '証拠を評価中...',
          detectingBias: 'バイアスを検出中...',
          generatingReport: 'レポートを生成中...'
        }
      },
      error: {
        failed: '分析に失敗しました',
        pleaseEnterText: '分析するテキストを入力してください',
        minCharacters: '少なくとも 10 文字入力してください',
        analysisFailedMsg: 'コンテンツの分析に失敗しました。もう一度お試しください。'
      },
      results: {
        claimAnalysis: '主張分析',
        analyzed: '分析済み',
        overallAssessment: '総合評価',
        exportReport: 'レポートをエクスポート',
        newAnalysis: '新しい分析',
        credibility: '信頼性'
      },
      verdicts: {
        guide: '判定ガイド',
        accurateTrue: '正確/真実',
        accurateTrueDesc: '主張は事実に正しく、強力な証拠によって支持されている',
        partiallyMisleading: '部分的に誤解を招く',
        partiallyMisleadingDesc: '一部の真実を含んでいるが、欺瞞的、不完全、または文脈から外れている',
        false: '虚偽',
        falseDesc: '主張は十分に確立された事実と証拠に矛盾している',
        unverifiable: '未確認',
        unverifiableDesc: '主張を確認または否定するための証拠が不十分である'
      },
      claimCard: {
        confidenceLevel: '信頼度レベル',
        detailedAnalysis: '詳細な分析',
        factBasedCorrection: '事実に基づく修正',
        evidenceSources: '証拠ソース',
        stepByStepReasoning: '段階的な推論プロセス',
        detectedBias: '検出されたバイアスと修辞的デバイス',
        noBias: '有意なバイアスは検出されませんでした',
        suggestedVisual: '推奨される視覚的証拠',
        suggested: '推奨:',
        searchTerms: '検索語:',
        trustedSources: '信頼できるソース:',
        assumptionsMade: '分析で行われた仮定',
        analysisLimitations: '分析の制限',
        methodology: '方法論:',
        methodologyText: 'この分析は、構造化されたファクトチェックプロトコルを備えた AI 駆動の証拠に基づく推論を使用しています。信頼度スコアは、利用可能な証拠とソースの信頼性に基づく確実性のレベルを反映しています。'
      },
      sidebar: {
        howItWorks: '仕組み',
        steps: {
          input: '入力',
          inputDesc: '分析用のテキストコンテンツを貼り付ける',
          extractClaims: '主張を抽出',
          extractClaimsDesc: 'LLM が個別の事実上の主張を特定する',
          evaluate: '評価',
          evaluateDesc: '各主張の精度、バイアス、文脈を分析する',
          report: 'レポート',
          reportDesc: '構造化された判定、修正、および推論トレース'
        },
        history: 'セッション履歴',
        historySubtitle: '最近の分析セッション',
        historyEmpty: 'まだ分析はありません。上記で最初のチェックを実行してください！',
        credibility: '信頼性',
        claims: '主張'
      },
      disclaimer: {
        title: '重要な免責事項',
        text: 'VeritasAI は大規模言語モデルを使用しており、ライブデータベースやリアルタイムニュースにはアクセスしません。判定は AI 生成の評価であり、決定的な事実上の裁定ではありません。常に一次情報源をクロス参照してください。信頼度スコアはモデルの確実性を反映しており、絶対的な真実ではありません。'
      },
      footer: {
        builtWith: 'で構築 OpenRouter',
        hackathon: 'ハッカソン 2026',
        responsibleAI: '責任ある AI · 透明な推論 · オープンソース'
      },
      toast: {
        done: '完了!',
        sampleLoaded: 'サンプルを読み込みました',
        inputCleared: '入力をクリアしました',
        analysisComplete: '分析が完了しました!',
        historyLoaded: '履歴項目を読み込みました',
        reportExported: 'レポートをエクスポートしました!',
        readyForNew: '新しい分析の準備ができました'
      },
      confidence: {
        veryHigh: '非常に高い信頼度',
        high: '高い信頼度',
        moderate: '中程度の信頼度',
        low: '低い信頼度',
        veryLow: '非常に低い信頼度',
        veryHighDesc: 'この判定を支持する複数の信頼できるソースを持つ強い合意',
        highDesc: '軽微な不確実性を伴う実質的な証拠が利用可能',
        moderateDesc: 'いくつかの証拠が存在するが、顕著な不確実性が残っている',
        lowDesc: '重要な不確実性を伴う限られた証拠が利用可能',
        veryLowDesc: '最小限の支持的証拠しかない非常に推測的'
      },
      sourceType: {
        news: 'ニュース機関',
        academic: '学術/研究',
        government: '政府ソース',
        factcheck: 'ファクトチェック機関'
      },
      visitSource: 'ソースを訪れる →'
    }
  },

  // Initialize i18n system
  init() {
    // Load saved language from localStorage
    const savedLanguage = localStorage.getItem('veritasai_language') || 'en';
    this.setLanguage(savedLanguage);
  },

  // Get translation by key path
  t(keyPath) {
    const keys = keyPath.split('.');
    let value = this.translations[this.currentLanguage];
    
    for (const key of keys) {
      if (value && typeof value === 'object' && key in value) {
        value = value[key];
      } else {
        // Fallback to English
        console.warn(`Translation missing for ${keyPath} in ${this.currentLanguage}`);
        return this.tEnglish(keyPath);
      }
    }
    
    return value || keyPath;
  },

  // Get English translation as fallback
  tEnglish(keyPath) {
    const keys = keyPath.split('.');
    let value = this.translations.en;
    
    for (const key of keys) {
      if (value && typeof value === 'object' && key in value) {
        value = value[key];
      } else {
        return keyPath;
      }
    }
    
    return value;
  },

  // Set current language
  setLanguage(lang) {
    if (!this.SUPPORTED_LANGUAGES.includes(lang)) {
      console.warn(`Unsupported language: ${lang}, falling back to English`);
      lang = 'en';
    }
    
    this.currentLanguage = lang;
    localStorage.setItem('veritasai_language', lang);
    document.documentElement.lang = lang;
    
    // Update UI direction for RTL languages if needed
    if (['ar', 'he'].includes(lang)) {
      document.documentElement.dir = 'rtl';
    } else {
      document.documentElement.dir = 'ltr';
    }
    
    // Trigger UI update
    this.updateUI();
  },

  // Get current language name in native script
  getLanguageName(code) {
    const names = {
      en: 'English',
      ta: 'தமிழ்',
      hi: 'हिन्दी',
      te: 'తెలుగు',
      ja: '日本語'
    };
    return names[code] || code;
  },

  // Update all UI elements with translations
  updateUI() {
    // Update all elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(element => {
      const key = element.getAttribute('data-i18n');
      const translation = this.t(key);
      
      if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
        if (element.hasAttribute('placeholder')) {
          element.placeholder = translation;
        }
      } else {
        element.textContent = translation;
      }
    });

    // Update all elements with data-i18n-placeholder attribute
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
      const key = element.getAttribute('data-i18n-placeholder');
      element.placeholder = this.t(key);
    });

    // Update all elements with data-i18n-title attribute
    document.querySelectorAll('[data-i18n-title]').forEach(element => {
      const key = element.getAttribute('data-i18n-title');
      element.title = this.t(key);
    });

    // Re-render sample pills with translated text
    if (typeof initSamplePills === 'function') {
      window.initSamplePills();
    }

    // Dispatch event for other components to listen
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: this.currentLanguage } }));
  },

  // Get confidence level translation
  getConfidenceLevel(confidence) {
    if (confidence >= 90) return this.t('confidence.veryHigh');
    if (confidence >= 70) return this.t('confidence.high');
    if (confidence >= 50) return this.t('confidence.moderate');
    if (confidence >= 30) return this.t('confidence.low');
    return this.t('confidence.veryLow');
  },

  // Get confidence description translation
  getConfidenceDescription(confidence) {
    if (confidence >= 90) return this.t('confidence.veryHighDesc');
    if (confidence >= 70) return this.t('confidence.highDesc');
    if (confidence >= 50) return this.t('confidence.moderateDesc');
    if (confidence >= 30) return this.t('confidence.lowDesc');
    return this.t('confidence.veryLowDesc');
  },

  // Get verdict translation
  getVerdict(verdict) {
    const verdictMap = {
      TRUE: 'verdicts.accurateTrue',
      MISLEADING: 'verdicts.partiallyMisleading',
      FALSE: 'verdicts.false',
      UNVERIFIABLE: 'verdicts.unverifiable'
    };
    return this.t(verdictMap[verdict] || 'verdicts.unverifiable');
  },

  // Get source type translation
  getSourceType(type) {
    const typeMap = {
      news: 'sourceType.news',
      academic: 'sourceType.academic',
      government: 'sourceType.government',
      factcheck: 'sourceType.factcheck'
    };
    return this.t(typeMap[type] || 'sourceType.academic');
  }
};

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => I18N.init());
} else {
  I18N.init();
}
