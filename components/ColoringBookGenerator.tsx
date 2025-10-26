import React, { useState, useCallback } from 'react';
import { generateColoringPages } from '../services/geminiService';
import Spinner from './Spinner';

// Type definition for jsPDF from CDN
declare const jspdf: any;

const ColoringBookGenerator: React.FC = () => {
    const [theme, setTheme] = useState<string>('uzay dinozorları');
    const [childName, setChildName] = useState<string>('Melis');
    const [images, setImages] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = useCallback(async () => {
        if (!theme || !childName) {
            setError("Lütfen bir tema ve bir isim girin.");
            return;
        }
        setIsLoading(true);
        setError(null);
        setImages([]);

        try {
            const generatedImages = await generateColoringPages(theme);
            setImages(generatedImages);
        } catch (err: any) {
            setError(err.message || 'Bilinmeyen bir hata oluştu.');
        } finally {
            setIsLoading(false);
        }
    }, [theme, childName]);

    const handleDownloadPdf = useCallback(() => {
        if (images.length === 0) return;
        
        const { jsPDF } = jspdf;
        const doc = new jsPDF({
            orientation: 'landscape',
            unit: 'px',
            format: 'a4'
        });

        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();

        // Cover Page
        doc.setFontSize(40);
        doc.setFont('helvetica', 'bold');
        doc.text(`${childName}'in`, pageWidth / 2, pageHeight / 2 - 40, { align: 'center' });
        doc.text(`Harika Boyama Kitabı`, pageWidth / 2, pageHeight / 2, { align: 'center' });
        doc.setFontSize(20);
        doc.setFont('helvetica', 'normal');
        doc.text(`Tema: ${theme}`, pageWidth / 2, pageHeight / 2 + 40, { align: 'center' });

        // Image Pages
        images.forEach((base64Img) => {
            doc.addPage();
            const imgData = `data:image/jpeg;base64,${base64Img}`;
            const imgProps = doc.getImageProperties(imgData);
            
            const margin = 20;
            const availableWidth = pageWidth - 2 * margin;
            const availableHeight = pageHeight - 2 * margin;

            const imgRatio = imgProps.width / imgProps.height;
            const pageRatio = availableWidth / availableHeight;
            
            let imgWidth, imgHeight;

            if (imgRatio > pageRatio) {
                imgWidth = availableWidth;
                imgHeight = availableWidth / imgRatio;
            } else {
                imgHeight = availableHeight;
                imgWidth = availableHeight * imgRatio;
            }

            const x = (pageWidth - imgWidth) / 2;
            const y = (pageHeight - imgHeight) / 2;

            doc.addImage(imgData, 'JPEG', x, y, imgWidth, imgHeight);
        });

        doc.save(`${childName}_${theme}_boyama_kitabı.pdf`);
    }, [images, childName, theme]);

    return (
        <div className="bg-white/80 backdrop-blur-sm shadow-2xl rounded-2xl p-6 md:p-8 border border-slate-200">
            <h2 className="text-3xl font-bold font-display text-slate-700 mb-4">Boyama Kitabını Oluştur</h2>
            <div className="space-y-4">
                <div>
                    <label htmlFor="theme" className="block text-sm font-medium text-slate-600 mb-1">Tema (ör. "Orman Hayvanları", "Büyülü Şatolar")</label>
                    <input
                        id="theme"
                        type="text"
                        value={theme}
                        onChange={(e) => setTheme(e.target.value)}
                        placeholder="Eğlenceli bir tema girin"
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition"
                    />
                </div>
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-slate-600 mb-1">Çocuğun Adı</label>
                    <input
                        id="name"
                        type="text"
                        value={childName}
                        onChange={(e) => setChildName(e.target.value)}
                        placeholder="Kapak için bir isim girin"
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition"
                    />
                </div>
            </div>

            {error && <p className="text-red-500 mt-4 bg-red-100 p-3 rounded-lg">{error}</p>}
            
            <button
                onClick={handleGenerate}
                disabled={isLoading}
                className="w-full mt-6 bg-purple-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-purple-700 disabled:bg-purple-300 transition-transform transform hover:scale-105 active:scale-100 flex items-center justify-center text-lg"
            >
                {isLoading ? <><Spinner /> Oluşturuluyor...</> : '✨ Sayfaları Oluştur'}
            </button>

            {isLoading && (
                <div className="text-center mt-6 text-slate-600">
                    <p>Yapay zeka sanatçımız sayfalarınızı çiziyor... bu biraz zaman alabilir!</p>
                </div>
            )}

            {images.length > 0 && !isLoading && (
                <div className="mt-8">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-2xl font-bold font-display text-slate-700">Boyama Sayfaların</h3>
                        <button
                            onClick={handleDownloadPdf}
                            className="bg-green-600 text-white font-bold py-2 px-5 rounded-lg hover:bg-green-700 transition-transform transform hover:scale-105 active:scale-100"
                        >
                            PDF İndir
                        </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {images.map((img, index) => (
                            <div key={index} className="aspect-w-4 aspect-h-3 bg-slate-100 rounded-lg overflow-hidden shadow-md">
                                <img src={`data:image/jpeg;base64,${img}`} alt={`Boyama sayfası ${index + 1}`} className="object-cover w-full h-full" />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ColoringBookGenerator;