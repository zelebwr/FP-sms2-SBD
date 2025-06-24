type ColorData = {
    name: string;
    hex: string;
};

export type Product = {
    SKU: string;
    Name: string;
    Description: string;
    Picture: string[];
    Rating: number;
    Review: number;
    Price: number;
    Category: 'Men' | 'Women' | 'Kids';
    Tags: string[];
    Color: ColorData[];
};

const dummyProducts: Product[] = [
    {
        SKU: 'SS001',
        Name: 'Lakhsmana Batik Prakasa',
        Description: 'A modern black batik shirt with elegant patterns.',
        Picture: ['/products/product1.png'],
        Rating: 3.6,
        Review: 10,
        Price: 2500000,
        Category: 'Men',
        Tags: ['Batik', 'Men', 'Formal'],
        Color: [
            { name: 'Black', hex: '#000000' },
            { name: 'Silver', hex: '#C0C0C0' }
        ]
    },
    {
        SKU: 'SS002',
        Name: 'Dewantara Batik Pria',
        Description: 'Stylish gray and black batik for the modern man.',
        Picture: ['/products/product2.png'],
        Rating: 4.9,
        Review: 8,
        Price: 3500000,
        Category: 'Men',
        Tags: ['Batik', 'Men'],
        Color: [
            { name: 'Brown', hex: '#5C4033' },
            { name: 'Black', hex: '#000000' },
            { name: 'Gold', hex: '#FFD700' }
        ]
    },
    {
        SKU: 'SS003',
        Name: 'Wira Batik Nusantara',
        Description: 'A classic black batik shirt with subtle details.',
        Picture: ['/products/product3.png'],
        Rating: 4.7,
        Review: 9,
        Price: 1500000,
        Category: 'Men',
        Tags: ['Batik', 'Men'],
        Color: [
            { name: 'Black', hex: '#000000' },
            { name: 'Silver', hex: '#C0C0C0' }
        ]
    },
    {
        SKU: 'SS004',
        Name: 'Batik Adyatama',
        Description: 'This batik shirt features a striking black base with intricate floral and geometric patterns.',
        Picture: ['/products/product4.png'],
        Rating: 4.5,
        Review: 6,
        Price: 2555000,
        Category: 'Men',
        Tags: ['Batik', 'Men', 'Classic'],
        Color: [
            { name: 'Brown', hex: '#5C4033' },
            { name: 'Black', hex: '#000000' },
            { name: 'Gold', hex: '#FFD700' }
        ]
    },
    {
        SKU: 'SS005',
        Name: 'Ranawijaya Batik',
        Description: 'Vibrant blue batik that makes a statement.',
        Picture: ['/products/product5.png'],
        Rating: 4.6,
        Review: 7,
        Price: 1500000,
        Category: 'Men',
        Tags: ['Batik', 'Men', 'Vibrant'],
        Color: [
            { name: 'Black', hex: '#000000' },
            { name: 'Silver', hex: '#C0C0C0' }
        ]
    },
    {
        SKU: 'SS006',
        Name: 'Sogan Rejodani',
        Description: 'Elegant Sogan batik with a deep blue hue.',
        Picture: ['/products/product6.png'],
        Rating: 4.8,
        Review: 11,
        Price: 500000,
        Category: 'Men',
        Tags: ['Batik', 'Men', 'Sogan'],
        Color: [
            { name: 'Brown', hex: '#5C4033' },
            { name: 'Black', hex: '#000000' },
            { name: 'Gold', hex: '#FFD700' }
        ]
    },
];

export const slugify = (text: string) =>
    text
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]+/g, '');

export const fetchProductBySlug = async (slug: string): Promise<Product | undefined> => {
    return new Promise(resolve => {
        setTimeout(() => {
            const product = dummyProducts.find(p => slugify(p.Name) === slug);
            resolve(product);
        }, 300);
    });
};

export const fetchProducts = async (category?: string): Promise<Product[]> => {
    console.log(`Fetching products for category: ${category}`);

    return new Promise(resolve => {
        setTimeout(() => {
            if (category) {
                const filteredProducts = dummyProducts.filter(
                    product => product.Category.toLowerCase() === category.toLowerCase()
                );
                resolve(filteredProducts);
            } else {
                resolve(dummyProducts);
            }
        }, 500);
    });
};