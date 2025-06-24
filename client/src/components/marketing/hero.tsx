"use client";

import Image from "next/image";
import React from 'react';

const Hero = () => {
    return (
        <>
            <section className="relative w-full bg-[#424669] text-white py-12 md:py-20 px-4">
                
                <div className="absolute top-0 left-0 w-full h-10 bg-[#676F9D]" />

                <div className="container mx-auto flex flex-col items-center">
                    
                    <div className="relative w-full h-100 md:h-96 mb-12 md:mb-16">
                <div className="absolute top-0 -translate-x-1/2 h-full flex">
                    {Array.from({ length: 6 }).map((_, index) => (
                        <Image
                            key={index}
                            src="/images/batik-pattern.png"
                            alt={`Pola batik ${index + 1}`}
                            width={400}
                            height={300}
                            objectFit="contain"
                            className={`ml-8 first:ml-0`}
                        />
                    ))}
                </div>
            </div>

                    <div className="text-center">
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight leading-tight">
                            Modern Batik. Cool Style
                            <br />
                            Indonesian Craftmanship.
                            <br />
                            Elevated
                        </h1>
                    </div>

                </div>
                <div className="absolute bottom-0 left-0 w-full h-10 bg-[#676F9D]" />
            </section>

            <section className="bg-[#424669] text-white">
                <div className="container mx-auto text-center py-16 px-4">
                    <h2 className="text-3xl font-light mb-4">
                        The origins of batik
                    </h2>
                    <p className="text-lg max-w-3xl mx-auto text-gray-300">
                        The origins of batik are widely debated, but batik truly evolved and became deeply rooted in the cultural fabric of Java, rocketing to wild popularity between the 19th and 20th centuries.
                    </p>
                </div>
            </section>
        </>
    )
};

export default Hero;