let raqueteJogador, raqueteComputador, bola, barraSuperior, barraInferior;
let imagemRaqueteJogador, imagemRaqueteComputador, imagemBola; // Imagens
let bounceSound, golSound; // Sons
let anguloBola = 0; // Ângulo de rotação da bola
let pontuacaoJogador = 0;
let pontuacaoComputador = 0;
let descricaoGol = ""; // Descrição do último gol
let jogoIniciado = false; // Variável para controlar o estado do jogo
let botao; // Variável global para o botão

// Precarrega as imagens e sons
function preload() {
  imagemRaqueteJogador = loadImage('assets/barra1.png');
  imagemRaqueteComputador = loadImage('assets/barra2.png');
  imagemBola = loadImage('assets/bola.png');
  bounceSound = loadSound('sounds/bounce.wav'); // Som de colisão com raquetes
  golSound = loadSound('sounds/golSound.wav'); // Som de gol
}

// Classe Raquete
class Raquete {
  constructor(x, y, w, h, imagem) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.imagem = imagem;
  }

  atualizar() {
    if (this === raqueteJogador) {
      this.y = constrain(mouseY, this.h / 2 + barraSuperior.h, height - this.h / 2 - barraInferior.h);
    } else {
      if (bola.y > this.y + this.h / 2) {
        this.y = constrain(this.y + 3, this.h / 2 + barraSuperior.h, height - this.h / 2 - barraInferior.h);
      } else if (bola.y < this.y - this.h / 2) {
        this.y = constrain(this.y - 3, this.h / 2 + barraSuperior.h, height - this.h / 2 - barraInferior.h);
      }
    }
  }

  exibir() {
    imageMode(CENTER);
    image(this.imagem, this.x, this.y, this.w, this.h);
  }
}

// Classe Bola
class Bola {
  constructor(r, imagem) {
    this.r = r;
    this.imagem = imagem;
    this.reiniciar();
  }

  reiniciar() {
    this.x = width / 2;
    this.y = height / 2;
    this.velocidadeX = random([-4, 4]);
    this.velocidadeY = random([-3, 3]);
  }

  atualizar() {
    this.x += this.velocidadeX;
    this.y += this.velocidadeY;

    // Colisão com as bordas superior e inferior
    if (this.y - this.r <= barraSuperior.h || this.y + this.r >= height - barraInferior.h) {
      this.velocidadeY *= -1;
    }

    // Detectar gol
    if (this.x - this.r <= 0) {
      pontuacaoComputador++;
      descricaoGol = "Gol do Computador!";
      falar(descricaoGol);
      if (golSound.isLoaded()) golSound.play();
      this.reiniciar();
    } else if (this.x + this.r >= width) {
      pontuacaoJogador++;
      descricaoGol = "Gol do Jogador!";
      falar(descricaoGol);
      if (golSound.isLoaded()) golSound.play();
      this.reiniciar();
    }

    anguloBola += sqrt(this.velocidadeX ** 2 + this.velocidadeY ** 2) * 0.1;
  }

  verificarColisaoRaquete(raquete) {
    if (
      this.x - this.r <= raquete.x + raquete.w / 2 &&
      this.x + this.r >= raquete.x - raquete.w / 2 &&
      this.y >= raquete.y - raquete.h / 2 &&
      this.y <= raquete.y + raquete.h / 2
    ) {
      this.velocidadeX *= -1;

      if (bounceSound.isLoaded()) bounceSound.play();

      this.velocidadeX *= 1.1;
      this.velocidadeY *= 1.1;
    }
  }

  exibir() {
    push();
    translate(this.x, this.y);
    rotate(anguloBola);
    imageMode(CENTER);
    image(this.imagem, 0, 0, this.r * 2, this.r * 2);
    pop();
  }
}

// Classe Barra
class Barra {
  constructor(y, h, cor) {
    this.y = y;
    this.h = h;
    this.cor = cor;
  }

  exibir() {
    fill(this.cor);
    rectMode(CORNER);
    rect(0, this.y, width, this.h);
  }
}

// Função para falar o texto
function falar(texto) {
  let sintese = window.speechSynthesis;
  let fala = new SpeechSynthesisUtterance(texto);
  sintese.speak(fala);
}

// Configuração inicial
function setup() {
  createCanvas(windowWidth, windowHeight);

  botao = createButton("Iniciar Jogo");
  botao.position(width / 2 - 50, height / 2 + 20);
  botao.mousePressed(() => {
    jogoIniciado = true;
    botao.remove(); // Remove o botão da tela
  });

  raqueteJogador = new Raquete(30, height / 2, 20, 100, imagemRaqueteJogador);
  raqueteComputador = new Raquete(width - 30, height / 2, 20, 100, imagemRaqueteComputador);
  bola = new Bola(10, imagemBola);
  barraSuperior = new Barra(0, 20, "#2B3FD6");
  barraInferior = new Barra(height - 20, 20, "#2B3FD6");
}

// Loop do jogo
function draw() {
  background("#000000");

  if (!jogoIniciado) {
    fill("white");
    textAlign(CENTER, CENTER);
    textSize(32);
    text("Jogo criado com JavaScript por Alexandre Milton Alves", width / 2, height / 2 - 50);
  } else {
    raqueteJogador.atualizar();
    raqueteComputador.atualizar();
    bola.atualizar();

    bola.verificarColisaoRaquete(raqueteJogador);
    bola.verificarColisaoRaquete(raqueteComputador);

    raqueteJogador.exibir();
    raqueteComputador.exibir();
    bola.exibir();
    barraSuperior.exibir();
    barraInferior.exibir();

    textSize(18);
    textAlign(CENTER);
    fill("red");
    text("Placar do Jogo", width / 2, barraSuperior.h + 15);

    fill("yellow");
    text(`${pontuacaoJogador} : ${pontuacaoComputador}`, width / 2, barraSuperior.h + 40);

    fill(255);
    textSize(24);
    text(descricaoGol, width / 2, height - 40);
  }
}
