document.addEventListener('DOMContentLoaded', function () {
    const featuresButton = document.getElementById('featuresButton');
    const teamButton = document.getElementById('teamButton');
    const features = document.getElementById('features');
    const team = document.getElementById('team');
    const canvas = document.getElementById('animationCanvas');
  
    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
  
    featuresButton.addEventListener('click', function () {
      features.style.display = 'block';
      team.style.display = 'none';
    });
  
    teamButton.addEventListener('click', function () {
      features.style.display = 'none';
      team.style.display = 'block';
    });
  
    window.addEventListener('resize', resizeCanvas);
  
    // Falling fruits
    const container = document.querySelector('.about');
    const fruitImages = [
      'images/사과.png', 'images/한라봉.png', 'images/귤.png', 'images/배.png',
      'images/포도.png', 'images/파인애플.png', 'images/토마토.png', 'images/키위.png',
      'images/코코넛.png', 'images/체리.png', 'images/참외.png', 'images/자몽.png',
      'images/자두.png', 'images/유자.png', 'images/용과.png', 'images/오미자.png',
      'images/오렌지.png', 'images/오디.png', 'images/아보카도.png', 'images/수박.png',
      'images/석류.png', 'images/살구.png', 'images/산딸기.png', 'images/사과.png',
      'images/블루베리.png', 'images/복숭아.png', 'images/복분자.png', 'images/바나나.png',
      'images/무화과.png', 'images/모과.png', 'images/멜론.png', 'images/매실.png',
      'images/망고스틴.png', 'images/망고.png', 'images/레몬.png', 'images/람부탄.png',
      'images/라임.png', 'images/딸기.png', 'images/두리안.png', 'images/감.png'
    ];
  
    function getRandomFruit() {
      return fruitImages[Math.floor(Math.random() * fruitImages.length)];
    }
  
    function getRandomPosition() {
      const x = Math.random() * (window.innerWidth - 50);
      return { x };
    }
  
    function createFruit() {
      const fruit = document.createElement('img');
      fruit.src = `../front/css/${getRandomFruit()}`;
      fruit.classList.add('fruit');
      fruit.style.position = 'absolute';
      fruit.style.width = '50px'; 
      fruit.style.height = '50px'; 
  
      const startPos = getRandomPosition();
      fruit.style.left = `${startPos.x}px`;
      fruit.style.top = `-50px`;
  
      container.appendChild(fruit);
  
      fruit.animate([
        { transform: `translateY(${window.innerHeight}px)` }
      ], {
        duration: Math.random() * 3000 + 2000,
        easing: 'linear',
        iterations: 1,
        fill: 'forwards'
      }).onfinish = () => {
        fruit.remove();
      };
  
      fruit.addEventListener('click', () => {
        fruit.classList.add('explode');
        setTimeout(() => fruit.remove(), 200); // Remove after animation
      });
    }
  
    for (let i = 0; i < 45; i++) {
      setTimeout(createFruit, Math.random() * 5000);
    }
  
    setInterval(() => {
      createFruit();
    }, Math.random() * 1000 + 500);
  
    resizeCanvas();
  });
  
  
  // title 보여주기 
  document.addEventListener('DOMContentLoaded', function() {
    const titles = document.querySelectorAll('.title');
  
    titles.forEach(title => {
        title.addEventListener('click', function() {
            const description = this.nextElementSibling;
  
            if (description.classList.contains('open')) {
                description.classList.remove('open');
            } else {
                description.classList.add('open');
            }
        });
    });
  });
  
  // 현재 컨텐츠 버튼 보여주기
  const buttons = document.querySelectorAll('.Mbtn');
  buttons.forEach((button, index) => {
    button.addEventListener('click', () => {
      // 모든 버튼의 active 클래스 제거
      buttons.forEach(btn => btn.classList.remove('active'));
      
      // 클릭한 버튼에 active 클래스 추가
      button.classList.add('active');
      
      // 클릭한 버튼에 해당하는 콘텐츠 박스에 active 클래스 추가
      contentBoxes[index].classList.add('active');
    });
  });