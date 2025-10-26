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
    cardId: number;
    slug: string;
    shareableUrl: string;
}

export interface ApiError {
    success: false;
    error: string;
    message: string;
    statusCode?: number;
}

export interface CreatePassResponse {
    success: boolean;
    passId: string;
    cardUrl: string;
    appleWalletUrl?: string | null;
    googlePayUrl?: string | null;
    passUrl?: string | null;
    downloadUrl?: string | null;
    message: string;
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
            const response = await fetch(`${this.baseUrl}/api/v1/cards/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(cardData),
            });

            // checking if the response is ok
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                // Handle rate limiting errors
                if (response.status === 429) {
                    throw new Error(errorData.detail || 'Rate limit exceeded. Please try again later.');
                }
                throw new Error(errorData.detail || errorData.message || `API request failed with status ${response.status}`);
            }

            const result: CreateCardResponse = await response.json();

            // validating the response structure
            if (!result.cardId || !result.slug) {
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

    async createPass(slug: string): Promise<CreatePassResponse> {
        try {
            const response = await fetch(`${this.baseUrl}/api/v1/passes/${slug}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.detail || `failed to create pass: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            throw new Error(error instanceof Error ? error.message : 'failed to create digital pass');
        }
    }

    async getPassDownload(slug: string): Promise<any> {
        try {
            const response = await fetch(`${this.baseUrl}/api/v1/passes/${slug}/download`);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.detail || `failed to get pass download: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            throw new Error(error instanceof Error ? error.message : 'failed to get pass download');
        }
    }

    async downloadAppleWalletPass(slug: string): Promise<void> {
        try {
            const response = await fetch(`${this.baseUrl}/api/v1/passes/${slug}/apple-wallet-pass`);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.detail || `failed to download Apple Wallet pass: ${response.status}`);
            }

            // Get the binary data
            const blob = await response.blob();

            // Create a download link and trigger it
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `quikard-${slug}.pkpass`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            throw new Error(error instanceof Error ? error.message : 'failed to download Apple Wallet pass');
        }
    }
}

// exporting a singleton instance
export const cardApiService = new CardApiService();