// Initialize the client with Vite environment variable
const API_KEY = (import.meta.env as any).VITE_GOOGLE_API_KEY || '';

// Mock responses for development
const mockResponses: Record<string, string> = {
  'revenue': 'Based on your current data, your total revenue for this period is 1,234,567 AED with a growth rate of 12.5% quarter-over-quarter. Your top-performing clients are Hilton JBR and Tech Solutions LLC.',
  'expenses': 'Your monthly expenses total 89,234 AED. Utilities account for 15% of expenses, while operational costs represent 45%. I recommend reviewing the travel category for potential savings.',
  'inventory': 'Current inventory status: 2,405 total SKUs with 15 items at critical low stock levels. Copper Cabling requires immediate reordering. Recommended action: Submit purchase order to primary suppliers.',
  'payroll': 'Next WPS payroll run scheduled for May 28th, 2024. Total payroll obligation: 142,500 AED for 142 employees. All compliance documents are current and ready.',
  'default': 'I am your Aljaberti AI Assistant. I can help you with financial analysis, inventory management, HR insights, and project status updates. What would you like to know about your ERP data?'
};

export const generateERPInsight = async (
  prompt: string, 
  contextData: string
): Promise<string> => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const lowerPrompt = prompt.toLowerCase();
    
    // Match keywords to mock responses
    if (lowerPrompt.includes('revenue') || lowerPrompt.includes('sales') || lowerPrompt.includes('income')) {
      return mockResponses['revenue'];
    } else if (lowerPrompt.includes('expense') || lowerPrompt.includes('cost')) {
      return mockResponses['expenses'];
    } else if (lowerPrompt.includes('inventory') || lowerPrompt.includes('stock')) {
      return mockResponses['inventory'];
    } else if (lowerPrompt.includes('payroll') || lowerPrompt.includes('salary') || lowerPrompt.includes('wps')) {
      return mockResponses['payroll'];
    }

    // If API key is available, could integrate real API here
    if (API_KEY) {
      console.log('Using real Gemini API with context:', contextData);
      // Future: Real API integration here
    }

    return mockResponses['default'];

  } catch (error) {
    console.error("AI Service Error:", error);
    return "I encountered an error processing your request. Please try again later.";
  }
};