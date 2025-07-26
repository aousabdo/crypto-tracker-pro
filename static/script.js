// Enhanced JavaScript for Crypto Tracker Pro
document.addEventListener('DOMContentLoaded', function() {
    console.log('Script loaded successfully!');
    
    const priceElement = document.getElementById('bitcoin-price');
    const changeElement = document.getElementById('change-24h');
    const highElement = document.getElementById('high-24h');
    const lowElement = document.getElementById('low-24h');
    const marketCapElement = document.getElementById('market-cap');
    const lastUpdatedElement = document.getElementById('last-updated');
    const loadingElement = document.querySelector('.loading-dots');
    
    let previousPrice = 0;
    
    // Create floating Bitcoin particles
    createParticles();
    
    // Initialize navigation
    initializeNavigation();
    
    // Fetch data immediately on load
    fetchBitcoinData();
    
    // Update data every 30 seconds
    setInterval(fetchBitcoinData, 30000);
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        if (e.key === 'r' || e.key === 'R') {
            fetchBitcoinData();
        }
        
        // Number keys for navigation
        const navTabs = document.querySelectorAll('.nav-tab');
        if (e.key >= '1' && e.key <= '5') {
            const tabIndex = parseInt(e.key) - 1;
            if (navTabs[tabIndex]) {
                navTabs[tabIndex].click();
            }
        }
    });
    
    // Initialize rotating fun facts
    initializeRotatingFacts();
    
    // Add hover effects to stat cards
    document.querySelectorAll('.stat-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Function to initialize navigation
    function initializeNavigation() {
        const navTabs = document.querySelectorAll('.nav-tab');
        const pages = document.querySelectorAll('.page');
        
        navTabs.forEach((tab, index) => {
            tab.addEventListener('click', () => {
                playClickSound();
                
                // Remove active class from all tabs and pages
                navTabs.forEach(t => t.classList.remove('active'));
                pages.forEach(p => p.classList.remove('active'));
                
                // Add active class to clicked tab and corresponding page
                tab.classList.add('active');
                pages[index].classList.add('active');
                
                // Load data for specific pages
                if (index === 1) { // Other Crypto page
                    loadCryptoData();
                } else if (index === 2) { // Deep Facts page
                    updateMarketStats();
                }
            });
        });
    }
    
    function playClickSound() {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.1);
        } catch (error) {
            console.log('Audio not supported');
        }
    }
    
    // Function to load crypto data for the "Other Crypto" page
    async function loadCryptoData() {
        try {
            const response = await fetch('https://api.binance.com/api/v3/ticker/24hr');
            const data = await response.json();
            
            const cryptoGrid = document.querySelector('.crypto-grid');
            if (!cryptoGrid) return;
            
            // Clear existing content
            cryptoGrid.innerHTML = '';
            
            // Top cryptocurrencies to display
            const topCryptos = ['ETHUSDT', 'BNBUSDT', 'SOLUSDT', 'XRPUSDT', 'ADAUSDT', 'DOGEUSDT', 'DOTUSDT', 'LTCUSDT'];
            
            topCryptos.forEach(symbol => {
                const crypto = data.find(item => item.symbol === symbol);
                if (crypto) {
                    const cryptoCard = document.createElement('div');
                    cryptoCard.className = 'crypto-card';
                    
                    const name = symbol.replace('USDT', '');
                    const price = parseFloat(crypto.lastPrice).toFixed(2);
                    const change = parseFloat(crypto.priceChangePercent).toFixed(2);
                    const changeClass = change >= 0 ? 'positive' : 'negative';
                    
                    cryptoCard.innerHTML = `
                        <div class="crypto-icon">${getCryptoIcon(name)}</div>
                        <div class="crypto-name">${name}</div>
                        <div class="crypto-price">$${price}</div>
                        <div class="crypto-change ${changeClass}">${change >= 0 ? '+' : ''}${change}%</div>
                    `;
                    
                    cryptoGrid.appendChild(cryptoCard);
                    
                    // Add hover effects
                    cryptoCard.addEventListener('mouseenter', () => {
                        cryptoCard.style.transform = 'translateY(-5px) scale(1.02)';
                        playHoverSound();
                    });
                    
                    cryptoCard.addEventListener('mouseleave', () => {
                        cryptoCard.style.transform = 'translateY(0) scale(1)';
                    });
                }
            });
            
            // Update market stats
            updateMarketStats();
            
        } catch (error) {
            console.error('Error loading crypto data:', error);
        }
    }
    
    function getCryptoIcon(symbol) {
        const icons = {
            'ETH': 'Ξ', 'BNB': '🟡', 'SOL': '◎', 'XRP': '🔵', 
            'ADA': '₳', 'DOGE': '🐕', 'DOT': '●', 'LTC': 'Ł'
        };
        return icons[symbol] || '🪙';
    }
    
    // Function to update market stats with real-time API data
    async function updateMarketStats() {
        try {
            // Fetch global market data from CoinGecko API
            const globalResponse = await fetch('https://api.coingecko.com/api/v3/global');
            const globalData = await globalResponse.json();
            
            // Fetch Bitcoin specific data
            const btcResponse = await fetch('https://api.coingecko.com/api/v3/coins/bitcoin');
            const btcData = await btcResponse.json();
            
            if (globalData.data && btcData) {
                const global = globalData.data;
                const btc = btcData;
                
                // Calculate real-time metrics
                const totalMarketCap = global.total_market_cap.usd;
                const totalVolume = global.total_volume.usd;
                const btcMarketCap = btc.market_data.market_cap.usd;
                const btcDominance = ((btcMarketCap / totalMarketCap) * 100).toFixed(1);
                
                // Update DOM with real-time data
                document.getElementById('total-market-cap').textContent = '$' + formatLargeNumber(totalMarketCap);
                document.getElementById('total-volume').textContent = '$' + formatLargeNumber(totalVolume);
                document.getElementById('btc-dominance').textContent = btcDominance + '%';
                
                console.log('Real-time market data updated:', {
                    totalMarketCap: formatLargeNumber(totalMarketCap),
                    totalVolume: formatLargeNumber(totalVolume),
                    btcDominance: btcDominance + '%',
                    btcMarketCap: formatLargeNumber(btcMarketCap)
                });
            }
            
        } catch (error) {
            console.error('Error fetching market stats:', error);
            // Fallback to Binance API if CoinGecko fails
            try {
                const response = await fetch('https://api.binance.com/api/v3/ticker/24hr');
                const data = await response.json();
                
                let totalVolume = 0;
                let btcVolume = 0;
                
                data.forEach(item => {
                    if (item.symbol.endsWith('USDT')) {
                        totalVolume += parseFloat(item.quoteVolume);
                        if (item.symbol === 'BTCUSDT') {
                            btcVolume = parseFloat(item.quoteVolume);
                        }
                    }
                });
                
                const btcDominance = ((btcVolume / totalVolume) * 100).toFixed(1);
                
                document.getElementById('total-market-cap').textContent = '$' + formatLargeNumber(totalVolume * 0.15);
                document.getElementById('total-volume').textContent = '$' + formatLargeNumber(totalVolume);
                document.getElementById('btc-dominance').textContent = btcDominance + '%';
                
            } catch (fallbackError) {
                console.error('Fallback API also failed:', fallbackError);
            }
        }
    }
    
    // Function to create floating Bitcoin particles
    function createParticles() {
        const particlesContainer = document.getElementById('particles');
        if (!particlesContainer) return;
        
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.textContent = '₿';
            
            // Random positioning across the entire viewport
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            
            // Random animation timing for each particle
            const delay = Math.random() * 10;
            const duration = 10 + Math.random() * 10;
            particle.style.animationDelay = delay + 's';
            particle.style.animationDuration = duration + 's';
            
            // Random size variation
            const size = 1 + Math.random() * 0.5;
            particle.style.fontSize = (1.5 * size) + 'rem';
            
            // Random opacity
            const opacity = 0.2 + Math.random() * 0.4;
            particle.style.opacity = opacity;
            
            particlesContainer.appendChild(particle);
        }
    }
    
    // Function to play sound effects
    function playSound(type) {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            if (type === 'positive') {
                oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(1200, audioContext.currentTime + 0.1);
            } else if (type === 'negative') {
                oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.1);
            }
            
            oscillator.type = 'sine';
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.1);
        } catch (error) {
            console.log('Audio not supported');
        }
    }
    
    // Function to play click sound
    function playClickSound() {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(600, audioContext.currentTime + 0.1);
            
            oscillator.type = 'sine';
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.1);
        } catch (error) {
            console.log('Audio not supported');
        }
    }
    
    // Function to play hover sound
    function playHoverSound() {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(800, audioContext.currentTime + 0.05);
            
            oscillator.type = 'sine';
            gainNode.gain.setValueAtTime(0.05, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.05);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.05);
        } catch (error) {
            console.log('Audio not supported');
        }
    }
    
    // Function to fetch Bitcoin data from API
    async function fetchBitcoinData() {
        try {
            const response = await fetch('/api/bitcoin');
            const result = await response.json();
            
            if (result.error) {
                priceElement.textContent = 'Error';
                changeElement.textContent = 'Error';
                return;
            }
            
            const data = result.data;
            if (!data) {
                priceElement.textContent = 'Error';
                changeElement.textContent = 'Error';
                return;
            }
            
            // Update price with animation
            const formattedPrice = data.price.toLocaleString();
            priceElement.textContent = '$' + formattedPrice;
            
            // Update change with color and sound
            const change = data.change_24h;
            const changeText = (change >= 0 ? '+' : '') + change + '%';
            changeElement.textContent = changeText;
            
            if (change >= 0) {
                changeElement.className = 'change positive';
                changeElement.innerHTML = '📈 ' + changeText;
            } else {
                changeElement.className = 'change negative';
                changeElement.innerHTML = '📉 ' + changeText;
            }
            
            // Play sound and create confetti for significant changes
            if (previousPrice > 0) {
                const priceChange = data.price - previousPrice;
                const percentChange = (priceChange / previousPrice) * 100;
                
                if (Math.abs(percentChange) > 1) {
                    if (percentChange > 0) {
                        playSound('positive');
                        createConfetti();
                    } else {
                        playSound('negative');
                    }
                }
            }
            
            previousPrice = data.price;
            
            // Update other stats
            highElement.textContent = '$' + data.high_24h.toLocaleString();
            lowElement.textContent = '$' + data.low_24h.toLocaleString();
            
            const marketCapFormatted = formatLargeNumber(data.market_cap);
            marketCapElement.textContent = '$' + marketCapFormatted;
            
            // Update last updated time
            const now = new Date();
            const timeString = now.toLocaleTimeString();
            lastUpdatedElement.textContent = timeString;
            
            // Hide loading indicator
            if (loadingElement) {
                loadingElement.style.display = 'none';
            }
            
            // Update comparisons
            updateComparisons(data.price);
            
        } catch (error) {
            console.error('Error fetching Bitcoin data:', error);
            priceElement.textContent = 'Error';
            changeElement.textContent = 'Error';
        }
    }
    
    // Function to create confetti effect
    function createConfetti() {
        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.style.cssText = `
                position: fixed;
                top: -10px;
                left: ${Math.random() * 100}%;
                width: 10px;
                height: 10px;
                background: ${['#ffd700', '#ff6b6b', '#00c9ff', '#51cf66'][Math.floor(Math.random() * 4)]};
                border-radius: 50%;
                pointer-events: none;
                z-index: 1000;
                animation: confetti-fall 3s linear forwards;
            `;
            document.body.appendChild(confetti);
            
            setTimeout(() => confetti.remove(), 3000);
        }
    }
    
    // Function to format large numbers
    function formatLargeNumber(num) {
        if (num >= 1e12) {
            return (num / 1e12).toFixed(2) + 'T';
        } else if (num >= 1e9) {
            return (num / 1e9).toFixed(2) + 'B';
        } else if (num >= 1e6) {
            return (num / 1e6).toFixed(2) + 'M';
        } else if (num >= 1e3) {
            return (num / 1e3).toFixed(2) + 'K';
        }
        return num.toLocaleString();
    }
    
    // Function to update comparison items
    function updateComparisons(bitcoinPrice) {
        const comparisons = [
            { name: 'Tesla Model 3', price: 45000, emoji: '🚗' },
            { name: 'Average US Home', price: 350000, emoji: '🏠' },
            { name: 'Big Macs', price: 6, emoji: '🍔' },
            { name: 'Starbucks Lattes', price: 5, emoji: '☕' },
            { name: 'iPhones', price: 1000, emoji: '📱' }
        ];
        
        comparisons.forEach((item, index) => {
            const quantity = Math.floor(bitcoinPrice / item.price);
            const element = document.querySelector(`.comparison:nth-child(${index + 1}) .comparison-value`);
            if (element) {
                element.textContent = quantity.toLocaleString();
                
                // Add progress bar
                const progressElement = element.parentElement.querySelector('.comparison-progress');
                if (progressElement) {
                    const progress = (bitcoinPrice / item.price) % 1;
                    progressElement.style.width = (progress * 100) + '%';
                }
                
                // Add hover effects and interactions
                const comparisonCard = element.closest('.comparison');
                if (comparisonCard) {
                    comparisonCard.addEventListener('mouseenter', () => {
                        comparisonCard.style.transform = 'translateY(-3px) scale(1.02)';
                        playHoverSound();
                    });
                    
                    comparisonCard.addEventListener('mouseleave', () => {
                        comparisonCard.style.transform = 'translateY(0) scale(1)';
                    });
                    
                    comparisonCard.addEventListener('click', () => {
                        // Add click animation
                        comparisonCard.style.transform = 'scale(0.95)';
                        setTimeout(() => {
                            comparisonCard.style.transform = 'scale(1)';
                        }, 150);
                        
                        // Show tooltip
                        showTooltip(comparisonCard, `${quantity.toLocaleString()} ${item.name} with 1 Bitcoin!`);
                    });
                }
            }
        });
    }
    
    // Function to initialize rotating fun facts
    async function initializeRotatingFacts() {
        // Get current Bitcoin price for dynamic calculations
        let currentBtcPrice = 117509; // Default fallback
        let currentMarketCap = 2.34; // Default fallback in trillions
        
        try {
            const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_market_cap=true');
            const data = await response.json();
            if (data.bitcoin) {
                currentBtcPrice = data.bitcoin.usd;
                currentMarketCap = data.bitcoin.usd_market_cap / 1e12; // Convert to trillions
            }
        } catch (error) {
            console.log('Using fallback values for fun facts');
        }
        
        const pizzaValue = (10000 * currentBtcPrice / 1e9).toFixed(2); // Convert to billions
        const marketCapTrillions = currentMarketCap.toFixed(2);
        
        const funFacts = [
            `🍕 In 2010, Laszlo Hanyecz paid 10,000 BTC for 2 pizzas. Today that's worth over $${pizzaValue} BILLION!`,
            "💰 The first Bitcoin transaction was worth $0.0008. Now a single transaction can be worth millions!",
            "🏠 You could buy a mansion with the Bitcoin lost in Satoshi's original wallet (estimated 1.1M BTC)",
            "⚡ Bitcoin mining uses more energy than entire countries like Argentina or Norway!",
            "🎯 There will only ever be 21 million Bitcoins - that's fewer than the population of Australia!",
            "🚀 Bitcoin's price has increased by over 146,000,000% since its creation in 2009!",
            "💎 The most expensive Bitcoin transaction fee ever paid was $3.1 million for a single transfer!",
            "🌍 Bitcoin is accepted in over 20,000 businesses worldwide, including Microsoft and Tesla!",
            "🔒 Bitcoin's blockchain has never been hacked - it's the most secure financial network ever created!",
            "🎪 The Winklevoss twins own over 1% of all Bitcoin in existence - that's over 100,000 BTC!",
            `🏦 Bitcoin's market cap is $${marketCapTrillions} trillion - larger than most countries' GDPs!`,
            "📱 You can send Bitcoin to anyone in the world in minutes, without banks or governments!",
            "🎲 The odds of guessing a Bitcoin private key are 1 in 2^256 - that's more than atoms in the universe!",
            "💸 Some people have thrown away hard drives containing millions of dollars worth of Bitcoin!",
            "🌙 Bitcoin has been called 'digital gold' and is now considered a store of value like precious metals!"
        ];
        
        const funFactsContainer = document.querySelector('.fun-facts');
        const currentFact = funFactsContainer.querySelector('.fun-fact');
        
        let currentIndex = 0;
        
        // Function to rotate facts
        function rotateFact() {
            currentFact.style.opacity = '0';
            currentFact.style.transform = 'translateY(-10px)';
            
            setTimeout(() => {
                currentFact.textContent = funFacts[currentIndex];
                currentFact.style.opacity = '1';
                currentFact.style.transform = 'translateY(0)';
                
                // Add special effects for certain facts
                if (funFacts[currentIndex].includes('🍕')) {
                    currentFact.style.color = '#ff6b6b';
                    currentFact.style.textShadow = '0 0 10px rgba(255, 107, 107, 0.5)';
                } else if (funFacts[currentIndex].includes('💰')) {
                    currentFact.style.color = '#ffd700';
                    currentFact.style.textShadow = '0 0 10px rgba(255, 215, 0, 0.5)';
                } else if (funFacts[currentIndex].includes('🚀')) {
                    currentFact.style.color = '#00c9ff';
                    currentFact.style.textShadow = '0 0 10px rgba(0, 201, 255, 0.5)';
                } else {
                    currentFact.style.color = '#ffd700';
                    currentFact.style.textShadow = '0 0 10px rgba(255, 215, 0, 0.3)';
                }
                
                currentIndex = (currentIndex + 1) % funFacts.length;
            }, 500);
        }
        
        // Start rotation
        setInterval(rotateFact, 6000); // Change every 6 seconds
        
        // Add click to manually advance
        funFactsContainer.addEventListener('click', () => {
            rotateFact();
        });
        
        // Add hover effect to show it's clickable
        funFactsContainer.style.cursor = 'pointer';
        funFactsContainer.title = 'Click to see next fact!';
    }
    
    // Add confetti animation
    const confettiStyle = document.createElement('style');
    confettiStyle.textContent = `
        @keyframes confetti-fall {
            to {
                transform: translateY(100vh) rotate(360deg);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(confettiStyle);

    // Function to show tooltip
    function showTooltip(element, text) {
        // Remove existing tooltips
        document.querySelectorAll('.tooltip').forEach(t => t.remove());
        
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = text;
        tooltip.style.cssText = `
            position: absolute;
            background: rgba(0, 0, 0, 0.9);
            color: white;
            padding: 8px 12px;
            border-radius: 6px;
            font-size: 0.9rem;
            z-index: 1000;
            pointer-events: none;
            white-space: nowrap;
            opacity: 0;
            transform: translateY(10px);
            transition: all 0.3s ease;
        `;
        
        document.body.appendChild(tooltip);
        
        // Position tooltip
        const rect = element.getBoundingClientRect();
        tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
        tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
        
        // Animate in
        setTimeout(() => {
            tooltip.style.opacity = '1';
            tooltip.style.transform = 'translateY(0)';
        }, 10);
        
        // Remove after 2 seconds
        setTimeout(() => {
            tooltip.style.opacity = '0';
            tooltip.style.transform = 'translateY(10px)';
            setTimeout(() => tooltip.remove(), 300);
        }, 2000);
    }
});