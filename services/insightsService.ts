import { AudienceData } from '../types';

// NOTE: This is a MOCK service for demonstration.

export const getAudienceData = (): Promise<AudienceData> => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({
                ageRange: {
                    '13-17': 15,
                    '18-24': 45,
                    '25-34': 30,
                    '35+': 10,
                },
                gender: {
                    'Male': 65,
                    'Female': 30,
                    'Other': 5,
                },
                geography: {
                    'USA': 40,
                    'Germany': 15,
                    'Brazil': 10,
                    'UK': 8,
                    'Canada': 7,
                    'Other': 20,
                },
            });
        }, 1000);
    });
};
