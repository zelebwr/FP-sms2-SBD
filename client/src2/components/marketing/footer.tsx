import Link from "next/link";
import Image from "next/image";
import Container from "../global/container";
import Wrapper from "../global/wrapper";
import Icons from "../global/icons";

const footerLinkSections = [
    {
        title: "Links",
        links: [
            { name: "Home", href: "/" },
            { name: "Explore", href: "/explore" },
            { name: "Men", href: "/men" },
            { name: "Woman", href: "/woman" },
            { name: "Kids", href: "/kids" },
        ],
    },
    {
        title: "Helps",
        links: [
            { name: "Privacy Policies", href: "/privacy-policy" },
            { name: "Terms of delivery", href: "/terms-delivery" },
            { name: "Frequently asked questions", href: "/faq" },
            { name: "Terms of use of the site", href: "/terms-of-use" },
            { name: "Contact Us", href: "/contact" },
        ],
    },
];

const Footer = () => {
    return (
        <footer className="w-full bg-[#2D3450] text-gray-300 py-12">
            <Container>
                <Wrapper className="flex flex-col md:flex-row justify-between gap-10">
                    <div className="flex flex-col max-w-sm md:max-w-xs">
                        <div className="mb-2">
                            <Image
                                src="/images/Logo-Javva.png"
                                alt="Logo JAVVA"
                                width={160}
                                height={60}
                            />
                        </div>
                        
                        <div className="flex items-center space-x-4 my-4">
                            <Link href="#" aria-label="Twitter">
                                <Icons.twitter className="w-5 h-5 hover:text-white transition-colors" />
                            </Link>
                            <Link href="#" aria-label="Facebook">
                                <Icons.facebook className="w-5 h-5 hover:text-white transition-colors" />
                            </Link>
                            <Link href="#" aria-label="Instagram">
                                <Icons.instagram className="w-5 h-5 hover:text-white transition-colors" />
                            </Link>
                        </div>
                        <p className="text-sm leading-relaxed">
                            We are a boutique batik clothing store located in the heart of Surabaya. Our curated collection bring you the artistry and elegance of batik.
                        </p>
                    </div>
                    <div className="flex space-x-24">
                        {footerLinkSections.map((section) => (
                            <div key={section.title} className="flex flex-col">
                                <h4 className="font-semibold text-white mb-4">
                                    {section.title}
                                </h4>
                                <ul className="space-y-3">
                                    {section.links.map((link) => (
                                        <li key={link.name}>
                                            <Link href={link.href} className="text-sm hover:text-white transition-colors">
                                                {link.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                </Wrapper>
            </Container>
        </footer>
    );
};

export default Footer;