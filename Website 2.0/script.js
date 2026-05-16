document.addEventListener('DOMContentLoaded', () => {
  // Mobile Menu Toggle
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });
  }

  // Navbar Scroll Effect
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.style.background = 'rgba(5, 5, 5, 0.9)';
      navbar.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.5)';
    } else {
      navbar.style.background = 'rgba(5, 5, 5, 0.7)';
      navbar.style.boxShadow = 'none';
    }
  });

  // Number Counter Animation
  const statNumbers = document.querySelectorAll('.stat-number');
  
  const animateStats = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = parseInt(entry.target.getAttribute('data-target'));
        let count = 0;
        const duration = 2000; // 2 seconds
        const increment = target / (duration / 16); // 60fps
        
        const updateCount = () => {
          count += increment;
          if (count < target) {
            entry.target.innerText = Math.ceil(count);
            requestAnimationFrame(updateCount);
          } else {
            entry.target.innerText = target;
          }
        };
        
        updateCount();
        observer.unobserve(entry.target);
      }
    });
  };

  const statsObserver = new IntersectionObserver(animateStats, { threshold: 0.5 });
  statNumbers.forEach(stat => statsObserver.observe(stat));

  // Particles Canvas
  const canvas = document.getElementById('particleCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particlesArray = [];
    const colors = ['#ff3366', '#7c3aed', '#06b6d4', '#ffffff'];

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = Math.random() * 1 - 0.5;
        this.speedY = Math.random() * 1 - 0.5;
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x > canvas.width) this.x = 0;
        else if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        else if (this.y < 0) this.y = canvas.height;
      }
      draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function init() {
      particlesArray = [];
      const numberOfParticles = (canvas.width * canvas.height) / 10000;
      for (let i = 0; i < numberOfParticles; i++) {
        particlesArray.push(new Particle());
      }
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
      }
      requestAnimationFrame(animate);
    }

    init();
    animate();

    window.addEventListener('resize', () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      init();
    });
  }

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if(targetId === '#') return;
      const targetElement = document.querySelector(targetId);
      if(targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth'
        });
        if(navLinks.classList.contains('active')){
          navLinks.classList.remove('active');
        }
      }
    });
  });

  // AI Chat Demo Simple Interaction
  const aiInput = document.getElementById('ai-demo-input');
  const aiSendBtn = document.getElementById('ai-send-btn');
  const aiChatBody = document.querySelector('.chat-body');

  if(aiInput && aiSendBtn && aiChatBody) {
    aiSendBtn.addEventListener('click', () => {
      // Create user message
      const userMsg = document.createElement('div');
      userMsg.className = 'chat-msg user';
      userMsg.innerHTML = '<div class="msg-bubble">Tell me more!</div>';
      aiChatBody.appendChild(userMsg);
      
      // Auto reply
      setTimeout(() => {
        const aiMsg = document.createElement('div');
        aiMsg.className = 'chat-msg ai';
        aiMsg.innerHTML = '<div class="msg-avatar">✦</div><div class="msg-bubble">I am GuruJi AI! Try the real version on our website to ask anything you want! 🚀</div>';
        aiChatBody.appendChild(aiMsg);
        aiChatBody.scrollTop = aiChatBody.scrollHeight;
      }, 1000);
    });
  }

  // --- WIKIPEDIA CONTENT FETCHING LOGIC ---
  
  // Helper to fetch and display Wikipedia Extract
  async function fetchWikiContent(topics, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    // Convert single string to array for search
    const topicsArray = Array.isArray(topics) ? topics : [topics];
    let loadedContent = false;
    let finalHtml = '';

    for (const topic of topicsArray) {
      try {
        const response = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(topic)}`);
        if (!response.ok) continue;
        const data = await response.json();
        
        let html = `<div style="background: rgba(255,255,255,0.02); padding: 2rem; border-radius: 15px; border: 1px solid var(--card-border); margin-bottom: 2rem; overflow: hidden;">`;
        html += `<h2 style="color:var(--text-primary); margin-bottom:0.5rem; font-size:2rem;">${data.title}</h2>`;
        if (data.description) html += `<p style="color:var(--accent-tertiary); margin-bottom:1.5rem; font-style:italic;">${data.description}</p>`;
        
        if (data.thumbnail && data.thumbnail.source) {
          html += `<img src="${data.thumbnail.source}" alt="${data.title}" style="max-width: 250px; border-radius: 10px; float: right; margin-left: 2rem; margin-bottom: 1rem; box-shadow: 0 10px 20px rgba(0,0,0,0.5);">`;
        }
        
        html += `<div style="color:var(--text-secondary); line-height: 1.8; font-size: 1.05rem;">${data.extract_html || data.extract}</div>`;
        html += `<div style="clear:both;"></div>`;
        
        if (data.content_urls && data.content_urls.desktop) {
           html += `<a href="${data.content_urls.desktop.page}" target="_blank" class="btn btn-secondary" style="margin-top:2rem; display:inline-flex;">Read full article →</a>`;
        }
        html += `</div>`;
        finalHtml += html;
        loadedContent = true;
      } catch (err) {
        console.error("Failed fetching: ", topic);
      }
    }

    if (loadedContent) {
      container.innerHTML = finalHtml;
    } else {
      container.innerHTML = `<p>Sorry, we couldn't load content. Try searching for something else!</p>`;
    }
  }

  // Execute fetch based on page elements
  // -- Topics --
  if (document.getElementById('wiki-container-education')) {
    fetchWikiContent(['Education', 'E-learning', 'Higher_education', 'Learning_theory_(education)'], 'wiki-container-education');
  }
  if (document.getElementById('wiki-container-technology')) {
    fetchWikiContent(['Technology', 'Artificial_intelligence', 'Information_technology', 'Emerging_technologies'], 'wiki-container-technology');
  }
  if (document.getElementById('wiki-container-dailylife')) {
    fetchWikiContent(['Everyday_life', 'Habit', 'Time_management', 'Well-being'], 'wiki-container-dailylife');
  }

  // --- INTERACTIVE TOOLS LOGIC (free-tools.html) ---
  // Tool 1: Text Analyzer
  const textInput = document.getElementById('text-tool-input');
  if (textInput) {
    const wordCount = document.getElementById('tool-words');
    const charCount = document.getElementById('tool-chars');
    textInput.addEventListener('input', () => {
      const text = textInput.value;
      charCount.innerText = text.length;
      wordCount.innerText = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
    });
  }

  // Tool 2: Password Generator
  const passGenBtn = document.getElementById('pass-gen-btn');
  if (passGenBtn) {
    const passOutput = document.getElementById('pass-output');
    const passLenSlider = document.getElementById('pass-length');
    const passLenDisplay = document.getElementById('pass-len-display');
    const passCopyBtn = document.getElementById('pass-copy-btn');
    
    passLenSlider.addEventListener('input', () => {
      passLenDisplay.innerText = passLenSlider.value;
    });
    
    passGenBtn.addEventListener('click', () => {
      const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=";
      let password = "";
      for (let i = 0; i < passLenSlider.value; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      passOutput.value = password;
    });
    
    passCopyBtn.addEventListener('click', () => {
      if(passOutput.value) {
        navigator.clipboard.writeText(passOutput.value);
        passCopyBtn.innerText = '✅';
        setTimeout(() => passCopyBtn.innerText = '📋', 2000);
      }
    });
  }

  // Tool 3: BMI Calculator
  const bmiBtn = document.getElementById('bmi-calc-btn');
  if (bmiBtn) {
    bmiBtn.addEventListener('click', () => {
      const weight = parseFloat(document.getElementById('bmi-weight').value);
      const height = parseFloat(document.getElementById('bmi-height').value) / 100;
      const resultDiv = document.getElementById('bmi-result');
      
      if (!weight || !height || weight <= 0 || height <= 0) {
        resultDiv.innerText = "Please enter valid numbers!";
        resultDiv.style.color = "#ff3366";
        return;
      }
      
      const bmi = (weight / (height * height)).toFixed(1);
      let status = "";
      let color = "";
      
      if (bmi < 18.5) { status = "Underweight"; color = "#06b6d4"; }
      else if (bmi >= 18.5 && bmi < 24.9) { status = "Normal weight"; color = "#10b981"; }
      else if (bmi >= 25 && bmi < 29.9) { status = "Overweight"; color = "#ffbd2e"; }
      else { status = "Obese"; color = "#ff3366"; }
      
      resultDiv.innerHTML = `BMI: <span>${bmi}</span> <span style="font-size:0.9rem; font-weight:normal; color:${color}; display:block; margin-top:0.5rem;">(${status})</span>`;
    });
  }

  // -- Features --
  if (document.getElementById('wiki-container-insights')) {
    fetchWikiContent(['Wisdom', 'Insight', 'Knowledge', 'Self-awareness'], 'wiki-container-insights');
  }
  if (document.getElementById('wiki-container-ask')) {
    fetchWikiContent(['Question', 'Information', 'Curiosity', 'Critical_thinking'], 'wiki-container-ask');
  }
  if (document.getElementById('wiki-container-explore')) {
    fetchWikiContent(['Learning', 'Exploration', 'Discovery_(observation)', 'Self-directed_learning'], 'wiki-container-explore');
  }

  // --- DAILY SPECIAL CALENDAR & "ON THIS DAY" ---
  const calendarWidget = document.getElementById('calendar-widget');
  const onThisDayContainer = document.getElementById('wiki-container-onthisday');
  
  if (calendarWidget && onThisDayContainer) {
    const today = new Date();
    const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    
    document.getElementById('cal-month').innerText = months[today.getMonth()];
    document.getElementById('cal-date').innerText = today.getDate();
    document.getElementById('cal-day').innerText = days[today.getDay()];

    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');

    fetch(`https://en.wikipedia.org/api/rest_v1/feed/onthisday/all/${mm}/${dd}`)
      .then(res => res.json())
      .then(data => {
        let finalHtml = '';
        
        // Events
        if(data.events && data.events.length > 0) {
          finalHtml += '<div style="margin-bottom: 3rem;">';
          finalHtml += '<h2 style="color:var(--accent-tertiary); margin-bottom: 1rem;"><span style="font-size:1.5rem">📜</span> Historical Events</h2>';
          finalHtml += '<ul style="padding-left:1.5rem; color:var(--text-secondary); line-height:1.8;">';
          data.events.slice(0, 7).forEach(ev => {
            finalHtml += `<li style="margin-bottom:1rem;"><strong>${ev.year}:</strong> ${ev.text}</li>`;
          });
          finalHtml += '</ul></div>';
        }

        // Births
        if(data.births && data.births.length > 0) {
          finalHtml += '<div style="margin-bottom: 3rem;">';
          finalHtml += '<h2 style="color:var(--accent-primary); margin-bottom: 1rem;"><span style="font-size:1.5rem">🎂</span> Famous Births</h2>';
          finalHtml += '<ul style="padding-left:1.5rem; color:var(--text-secondary); line-height:1.8;">';
          data.births.slice(0, 5).forEach(ev => {
            finalHtml += `<li style="margin-bottom:1rem;"><strong>${ev.year}:</strong> ${ev.text}</li>`;
          });
          finalHtml += '</ul></div>';
        }

        // Deaths
        if(data.deaths && data.deaths.length > 0) {
          finalHtml += '<div>';
          finalHtml += '<h2 style="color:var(--accent-secondary); margin-bottom: 1rem;"><span style="font-size:1.5rem">🕊️</span> Notable Deaths</h2>';
          finalHtml += '<ul style="padding-left:1.5rem; color:var(--text-secondary); line-height:1.8;">';
          data.deaths.slice(0, 5).forEach(ev => {
            finalHtml += `<li style="margin-bottom:1rem;"><strong>${ev.year}:</strong> ${ev.text}</li>`;
          });
          finalHtml += '</ul></div>';
        }

        if(finalHtml === '') finalHtml = '<p>No historical events found for today.</p>';
        onThisDayContainer.innerHTML = finalHtml;
      }).catch(err => {
        onThisDayContainer.innerHTML = '<p>Failed to load daily events.</p>';
      });
  }

  // --- HOMEPAGE DAILY IMPORTANCE AUTO-UPDATE ---
  const dailyFactCardText = document.getElementById('daily-fact-text');
  const dailyFactTitle = document.getElementById('daily-fact-title');
  const dailyFactFooter = document.getElementById('daily-fact-footer');

  if (dailyFactCardText && dailyFactTitle) {
    const today = new Date();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const monthsStr = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const currentDateString = `${monthsStr[today.getMonth()]} ${today.getDate()}`;
    
    fetch(`https://en.wikipedia.org/api/rest_v1/feed/onthisday/all/${mm}/${dd}`)
      .then(res => res.json())
      .then(data => {
        // First check for Holidays/Observances (Importance of the day)
        if(data.holidays && data.holidays.length > 0) {
          const holiday = data.holidays[0];
          dailyFactTitle.innerText = `Today is ${currentDateString}`;
          dailyFactCardText.innerText = `Importance: ${holiday.text}.`;
          if (dailyFactFooter) dailyFactFooter.innerText = "🌟 Daily Observance";
        } 
        // Fallback to top historical event if no holidays
        else if (data.events && data.events.length > 0) {
          const ev = data.events[0];
          dailyFactTitle.innerText = `On this day in ${ev.year}`;
          dailyFactCardText.innerText = ev.text;
          if (dailyFactFooter) dailyFactFooter.innerText = "📜 Historical Event";
        } else {
          dailyFactTitle.innerText = `Today is ${currentDateString}`;
          dailyFactCardText.innerText = "Enjoy your day and keep learning new things!";
        }
      })
      .catch(err => {
        dailyFactTitle.innerText = `Today's Special`;
        dailyFactCardText.innerText = "Failed to load today's importance. Please check your internet connection.";
      });
  }

  // --- SEARCH LOGIC ---
  const searchInputs = document.querySelectorAll('#site-search');
  const searchBtns = document.querySelectorAll('#search-btn');

  const doSearch = (query) => {
    if(!query.trim()) return;
    window.location.href = `search.html?q=${encodeURIComponent(query.trim())}`;
  };

  searchInputs.forEach((input, index) => {
    input.addEventListener('keypress', (e) => {
      if(e.key === 'Enter') doSearch(input.value);
    });
    if(searchBtns[index]) {
      searchBtns[index].addEventListener('click', () => doSearch(input.value));
    }
  });

  // Handle Search Results Page
  const searchContainer = document.getElementById('wiki-container-search');
  const queryDisplay = document.getElementById('search-query-display');
  
  if (searchContainer && queryDisplay) {
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('q');
    
    if(query) {
      queryDisplay.innerText = query;
      fetchWikiContent(query, 'wiki-container-search');
    } else {
      queryDisplay.innerText = 'Nothing';
      searchContainer.innerHTML = '<p>Please enter a search term in the search bar above.</p>';
    }
  }

  // --- FLOATING AI WIDGET FOR WHOLE SITE ---
  function createFloatingWidget() {
    const widgetBtn = document.createElement('div');
    widgetBtn.innerHTML = '<img src="logo.png" style="width: 35px; height: 35px; border-radius: 50%;" />';
    widgetBtn.id = 'global-ai-btn';
    widgetBtn.style.cssText = `
      position: fixed; bottom: 30px; right: 30px; width: 60px; height: 60px;
      background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
      border-radius: 50%; display: flex; justify-content: center; align-items: center;
      font-size: 2rem; color: white; cursor: pointer; box-shadow: 0 10px 30px var(--glow-primary);
      z-index: 9999; transition: transform 0.3s;
    `;
    widgetBtn.onmouseover = () => widgetBtn.style.transform = 'scale(1.1)';
    widgetBtn.onmouseout = () => widgetBtn.style.transform = 'scale(1)';
    
    const widgetBox = document.createElement('div');
    widgetBox.id = 'global-ai-box';
    widgetBox.style.cssText = `
      position: fixed; bottom: 100px; right: 30px; width: 320px; height: 420px;
      background: rgba(15, 15, 15, 0.95); border: 1px solid var(--glass-border);
      border-radius: 20px; box-shadow: 0 20px 40px rgba(0,0,0,0.5); z-index: 9998;
      backdrop-filter: blur(20px); display: none; flex-direction: column; overflow: hidden;
      transform-origin: bottom right; transition: all 0.3s ease;
    `;
    
    widgetBox.innerHTML = `
      <div style="background: rgba(25,25,25,0.9); padding: 1rem; border-bottom: 1px solid rgba(255,255,255,0.05); display: flex; align-items: center; justify-content: space-between;">
        <div style="display:flex; align-items:center; gap:0.5rem;">
          <img src="logo.png" style="height: 25px; border-radius: 5px;" />
          <span style="font-weight:600;">GuruJi AI</span>
        </div>
        <button id="close-widget" style="background:none; border:none; color:white; font-size:1.5rem; cursor:pointer; line-height:1;">×</button>
      </div>
      <div id="widget-chat-body" style="flex:1; padding:1.2rem; overflow-y:auto; display:flex; flex-direction:column; gap:1rem;">
        <div style="background: rgba(255,255,255,0.05); padding:0.8rem 1rem; border-radius: 0 15px 15px 15px; font-size:0.9rem; max-width:85%; border: 1px solid rgba(255,255,255,0.05);">
          Hi! I am GuruJi AI. You can ask me anything and I will search the site's Wikipedia integration for you! 🚀
        </div>
      </div>
      <div style="padding:1rem; border-top: 1px solid rgba(255,255,255,0.05); display:flex; gap:0.8rem; background: rgba(10,10,10,0.9);">
        <input type="text" id="widget-input" placeholder="Ask anything..." style="flex:1; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); border-radius:50px; padding:0.6rem 1.2rem; color:white; outline:none; font-family:'Inter', sans-serif;">
        <button id="widget-send" style="background:var(--accent-primary); border:none; width:40px; height:40px; border-radius:50%; color:white; font-size:1.2rem; cursor:pointer; display:flex; justify-content:center; align-items:center; transition:0.3s;">➔</button>
      </div>
    `;
    
    document.body.appendChild(widgetBox);
    document.body.appendChild(widgetBtn);
    
    let isOpen = false;
    window.toggleGuruJiWidget = () => {
      isOpen = !isOpen;
      widgetBox.style.display = isOpen ? 'flex' : 'none';
      if(isOpen) document.getElementById('widget-input').focus();
    };
    
    widgetBtn.onclick = window.toggleGuruJiWidget;
    document.getElementById('close-widget').onclick = window.toggleGuruJiWidget;
    
    const wInput = document.getElementById('widget-input');
    const wSend = document.getElementById('widget-send');
    const wBody = document.getElementById('widget-chat-body');
    
    const handleSend = () => {
      const text = wInput.value.trim();
      if(!text) return;
      
      const uMsg = document.createElement('div');
      uMsg.style.cssText = 'align-self: flex-end; background: var(--accent-secondary); padding: 0.8rem 1rem; border-radius: 15px 0 15px 15px; font-size: 0.9rem; max-width: 85%; color: white;';
      uMsg.innerText = text;
      wBody.appendChild(uMsg);
      wInput.value = '';
      wBody.scrollTop = wBody.scrollHeight;
      
      setTimeout(() => {
        const aMsg = document.createElement('div');
        aMsg.style.cssText = 'background: rgba(255,255,255,0.05); padding: 0.8rem 1rem; border-radius: 0 15px 15px 15px; font-size: 0.9rem; max-width: 85%; border: 1px solid rgba(255,255,255,0.05);';
        aMsg.innerHTML = `Here's what I found for "<strong>${text}</strong>": <br><br><a href="search.html?q=${encodeURIComponent(text)}" style="color:var(--accent-tertiary); text-decoration:none; font-weight:bold;">View Search Results ➔</a>`;
        wBody.appendChild(aMsg);
        wBody.scrollTop = wBody.scrollHeight;
      }, 800);
    };
    
    wSend.onclick = handleSend;
    wInput.onkeypress = (e) => { if(e.key === 'Enter') handleSend(); };
  }

  createFloatingWidget();

});
