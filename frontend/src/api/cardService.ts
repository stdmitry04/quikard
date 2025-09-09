// api/cardService.ts
export interface CreateCardRequest {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    company?: string;
    title?: string;
    bio?: string;
    profilePicture?: string;
    links: Array<{
        type: string;
        url: string;
        label?: string;
    }>;
}

export interface CreateCardResponse {
    success: boolean;
    cardId: string;
    slug: string;
    shareableUrl: string;
    qrCodeUrl?: string;
    message?: string;
}

export interface ApiError {
    success: false;
    error: string;
    message: string;
    statusCode?: number;
}

class CardApiService {
    private baseUrl: string;

    constructor() {
        // using environment variable or default to localhost for development
        this.baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    }

    async createCard(cardData: CreateCardRequest): Promise<CreateCardResponse> {
        try {
            // making the actual api call to create the card
            const response = await fetch(`${this.baseUrl}/api/v1/cards`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // add auth headers if needed
                    // 'Authorization': `Bearer ${getAuthToken()}`,
                },
                body: JSON.stringify(cardData),
            });

            // checking if the response is ok
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `API request failed with status ${response.status}`);
            }

            const result: CreateCardResponse = await response.json();

            // validating the response structure
            if (!result.success || !result.cardId || !result.slug) {
                throw new Error('Invalid response format from server');
            }

            return result;
        } catch (error) {
            // handling different types of errors
            if (error instanceof TypeError && error.message.includes('fetch')) {
                throw new Error('Network error - please check your connection');
            }

            throw new Error(error instanceof Error ? error.message : 'Failed to create card');
        }
    }

    async updateCard(cardId: string, cardData: Partial<CreateCardRequest>): Promise<CreateCardResponse> {
        try {
            const response = await fetch(`${this.baseUrl}/api/v1/cards/${cardId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(cardData),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.detail || `update failed with status ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            throw new Error(error instanceof Error ? error.message : 'failed to update card');
        }
    }

    async getCard(slug: string): Promise<any> {
        try {
            const response = await fetch(`${this.baseUrl}/api/v1/cards/${slug}`);

            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('business card not found');
                }
                throw new Error(`failed to fetch card: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            throw new Error(error instanceof Error ? error.message : 'failed to fetch card');
        }
    }
}

// exporting a singleton instance
export const cardApiService = new CardApiService();