import React from 'react';
import Image from 'next/image';

const featureData = [
  {
    title: "Premium materials.",
    description: "We source only the finest modern batik fabric for unmatched quality and feel.",
    imageSrc: "/images/figur1.png",
    alt: "Wanita mengenakan atasan batik modern berwarna merah dan biru."
  },
  {
    title: "Contemporary design",
    description: "Fusion with Javanese tradition with modern minimalism for a truly unique look.",
    imageSrc: "/images/figur2.png",
    alt: "Pria mengenakan kemeja batik modern berwarna krem."
  },
  {
    title: "Sustainable production.",
    description: "Crafted responsibly by skilled artisans in Indonesia, supporting local communities.",
    imageSrc: "/images/figur3.png",
    alt: "Anak-anak mengenakan pakaian batik modern berwarna biru."
  }
];

const galleryImages = [
  { 
    src: '/images/figur4.png', 
    alt: 'Keluarga mengenakan koleksi batik sarimbit berwarna kuning cerah.' 
  },
  { 
    src: '/images/figur5.png', 
    alt: 'Keluarga duduk di sofa mengenakan koleksi batik berwarna ungu lembut.' 
  },
  { 
    src: '/images/figur6.png', 
    alt: 'Ibu dan anak perempuan berpose dengan gaun batik kuning yang serasi.' 
  },
  { 
    src: '/images/figur7.png', 
    alt: 'Ibu dan anak perempuan di luar ruangan dengan gaun batik ungu yang serasi.' 
  },
];

const Connect = () => {
    return (
      <>
        <section className="bg-[#EFE8DB] py-20 md:py-6">
            <div className="container mx-auto px-4">

                <h2 className="text-4xl md:text-5xl font-serif text-center text-gray-800 mb-20">
                    Stay cool & elegant
                </h2>

                <div className="space-y-20">
                    {featureData.map((feature, index) => (
                        <div 
                            key={feature.title} 
                            className="flex flex-col md:flex-row items-center justify-center gap-10 md:gap-20"
                        >
                            <div className={`w-full md:w-5/12 ${index % 2 !== 0 ? 'md:order-last' : ''}`}>
                                <Image
                                    src={feature.imageSrc}
                                    alt={feature.alt}
                                    width={500}
                                    height={500}
                                    className="rounded-lg object-cover w-full h-auto shadow-md"
                                />
                            </div>

                            <div className="w-full md:w-4/12 text-center md:text-left">
                                <h3 className="text-3xl font-medium text-gray-900">
                                    {feature.title}
                                </h3>
                                <p className="mt-3 text-lg text-gray-700">
                                    {feature.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="bg-[#676F9D] py-5 mt-6">
              <h2 className="text-[#EFE8DB] text-center text-3xl md:text-4xl font-bold tracking-widest uppercase">
                15% OFF NOW!
              </h2>
            </div>

            <div className="w-full mt-6">
              <Image
                src="/images/home_batik_panjang.png"
                alt="Tumpukan kain batik aneka warna yang sedang promo"
                width={1920}
                height={1080}
                className="w-full h-auto"
              />
            </div>
        </section>
        <section className="bg-[#676F9D] py-10 md:py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
            {galleryImages.map((image, index) => (
              <div key={index} className="overflow-hidden rounded-md">
                <Image
                  src={image.src}
                  alt={image.alt}
                  width={700}
                  height={700}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300 ease-in-out shadow-md"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
      </>
    );
};

export default Connect;