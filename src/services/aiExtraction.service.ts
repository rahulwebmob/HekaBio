/**
 * AI Data Extraction Service (Mock)
 * Simulates AI extraction of data from uploaded introduction decks
 */

export interface ExtractedField {
  field: string;
  label: string;
  value: string;
  confidence: number; // 0-100
  source: string; // e.g., "Slide 3, Header"
}

export interface ExtractionResult {
  status: 'processing' | 'completed' | 'failed';
  fields: ExtractedField[];
  processedAt?: string;
  processingTime?: number; // seconds
}

/**
 * Mock AI extraction - simulates extracting data from an uploaded file
 */
export async function extractDataFromDeck(
  file: File
): Promise<ExtractionResult> {
  // In production, this would process the actual file
  console.log('Processing file:', file.name);

  // Simulate processing delay (2-4 seconds)
  const processingTime = 2 + Math.random() * 2;
  await new Promise((resolve) => setTimeout(resolve, processingTime * 1000));

  // Mock extracted data with confidence scores
  const mockFields: ExtractedField[] = [
    {
      field: 'companyName',
      label: 'Company Name',
      value: generateMockCompanyName(),
      confidence: 95 + Math.random() * 5,
      source: 'Slide 1, Title',
    },
    {
      field: 'productName',
      label: 'Product Name',
      value: generateMockProductName(),
      confidence: 90 + Math.random() * 10,
      source: 'Slide 2, Header',
    },
    {
      field: 'description',
      label: 'Description',
      value: generateMockDescription(),
      confidence: 85 + Math.random() * 10,
      source: 'Slide 3, Body Text',
    },
    {
      field: 'diseaseArea',
      label: 'Disease Area',
      value: generateMockDiseaseArea(),
      confidence: 92 + Math.random() * 8,
      source: 'Slide 4, Indication',
    },
    {
      field: 'stage',
      label: 'Development Stage',
      value: generateMockStage(),
      confidence: 88 + Math.random() * 10,
      source: 'Slide 5, Pipeline',
    },
    {
      field: 'country',
      label: 'Country',
      value: generateMockCountry(),
      confidence: 97 + Math.random() * 3,
      source: 'Slide 1, Footer',
    },
    {
      field: 'website',
      label: 'Website',
      value: generateMockWebsite(),
      confidence: 99,
      source: 'Slide 1, Footer',
    },
    {
      field: 'targetMarket',
      label: 'Target Market',
      value: generateMockTargetMarket(),
      confidence: 80 + Math.random() * 15,
      source: 'Slide 6, Market Analysis',
    },
    {
      field: 'fundingStatus',
      label: 'Funding Status',
      value: generateMockFundingStatus(),
      confidence: 75 + Math.random() * 15,
      source: 'Slide 7, Financials',
    },
  ];

  return {
    status: 'completed',
    fields: mockFields,
    processedAt: new Date().toISOString(),
    processingTime: Math.round(processingTime * 10) / 10,
  };
}

// Mock data generators
function generateMockCompanyName(): string {
  const prefixes = ['Bio', 'Med', 'Neuro', 'Cardio', 'Onco', 'Immuno', 'Gene'];
  const suffixes = ['Tech', 'Pharma', 'Therapeutics', 'Sciences', 'Labs', 'Health'];
  return `${prefixes[Math.floor(Math.random() * prefixes.length)]}${
    suffixes[Math.floor(Math.random() * suffixes.length)]
  }`;
}

function generateMockProductName(): string {
  const codes = ['BT', 'MT', 'NT', 'CT', 'OT', 'IT', 'GT'];
  const numbers = Math.floor(Math.random() * 9000) + 1000;
  return `${codes[Math.floor(Math.random() * codes.length)]}-${numbers}`;
}

function generateMockDescription(): string {
  const descriptions = [
    'Novel small molecule targeting key pathway in disease progression',
    'Proprietary antibody therapy with unique mechanism of action',
    'Next-generation gene therapy platform for rare diseases',
    'AI-driven drug discovery platform for personalized medicine',
    'Cell therapy approach using engineered immune cells',
    'mRNA-based vaccine technology for infectious diseases',
    'Diagnostic platform for early disease detection',
  ];
  return descriptions[Math.floor(Math.random() * descriptions.length)];
}

function generateMockDiseaseArea(): string {
  const areas = [
    'Oncology',
    'Neurology',
    'Cardiology',
    'Immunology',
    'Rare Diseases',
    'Infectious Diseases',
    'Metabolic Disorders',
    'Ophthalmology',
  ];
  return areas[Math.floor(Math.random() * areas.length)];
}

function generateMockStage(): string {
  const stages = [
    'Preclinical',
    'Phase I',
    'Phase I/II',
    'Phase II',
    'Phase III',
    'Discovery',
    'Lead Optimization',
  ];
  return stages[Math.floor(Math.random() * stages.length)];
}

function generateMockCountry(): string {
  const countries = [
    'United States',
    'United Kingdom',
    'Germany',
    'Switzerland',
    'Israel',
    'Singapore',
    'Japan',
    'South Korea',
    'Canada',
    'Australia',
  ];
  return countries[Math.floor(Math.random() * countries.length)];
}

function generateMockWebsite(): string {
  const companyName = generateMockCompanyName().toLowerCase();
  return `https://www.${companyName}.com`;
}

function generateMockTargetMarket(): string {
  const markets = [
    'Global - US, EU, Japan',
    'US and EU markets',
    'Asia-Pacific region',
    'North America',
    'European Union',
    'Global',
  ];
  return markets[Math.floor(Math.random() * markets.length)];
}

function generateMockFundingStatus(): string {
  const statuses = [
    'Series A - $15M raised',
    'Series B - $45M raised',
    'Seed - $5M raised',
    'Series C - $80M raised',
    'Bootstrapped',
    'Grant funded - $2M',
  ];
  return statuses[Math.floor(Math.random() * statuses.length)];
}
