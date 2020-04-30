// This file is part of www.nand2tetris.org
// and the book "The Elements of Computing Systems"
// by Nisan and Schocken, MIT Press.
// File name: projects/04/Mult.asm

// Multiplies R0 and R1 and stores the result in R2.
// (R0, R1, R2 refer to RAM[0], RAM[1], and RAM[2], respectively.)

// Put your code here.
  @R2
  M=0 // R2 = 0
  @R0
  D=M // D = R0
  @i
  M=D // i = D

(LOOP)
  @i
  D=M // D=i
  @END
  D;JQE // もし i = 0 ならば END へ移動
  @R1
  D=M // D = R1
  @R2
  M=D+M // R2 = R2 + R1
  @i
  M=M-1 // i=i-1
  @LOOP
  0;JMP // LOOP に戻る
(END)
  @END
  0;JMP // 無限ループ