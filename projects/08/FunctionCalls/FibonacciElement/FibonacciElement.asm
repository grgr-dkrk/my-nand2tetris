@256
D=A
@SP
M=D
// call Sys.init
@RETURNbootstrap
D=A
@SP
A=M
M=D
@SP
M=M+1
@LCL
D=M
@SP
A=M
M=D
@SP
M=M+1
@ARG
D=M
@SP
A=M
M=D
@SP
M=M+1
@THIS
D=M
@SP
A=M
M=D
@SP
M=M+1
@THAT
D=M
@SP
A=M
M=D
@SP
M=M+1
D=M
@0
D=D-A
@5
D=D-A
@ARG
M=D
@SP
D=M
@LCL
M=D
@Sys.init
0;JMP
(RETURNbootstrap)
// function Main.fibonacci
(Main.fibonacci)
// push argument 0
@0
D=A
@ARG
A=M
D=D+A
A=D
D=M
@SP
A=M
M=D
@SP
M=M+1
// push constant 2
@2
D=A
@SP
A=M
M=D
@SP
M=M+1
// lt
@SP
AM=M-1
D=M
@SP
AM=M-1
A=M
D=A-D
@TRUE0
D;JLT
D=0
@SP
A=M
M=D
@SP
M=M+1
@END1
0;JMP
(TRUE0)
D=-1
@SP
A=M
M=D
@SP
M=M+1
(END1)
// if-goto Main.fibonacci$IF_TRUE
@SP
M=M-1
A=M
D=M
@Main.fibonacci$IF_TRUE
D;JNE
// goto Main.fibonacci$IF_FALSE
@Main.fibonacci$IF_FALSE
0;JMP
// add Label Main.fibonacci$IF_TRUE
(Main.fibonacci$IF_TRUE)
// push argument 0
@0
D=A
@ARG
A=M
D=D+A
A=D
D=M
@SP
A=M
M=D
@SP
M=M+1
// return
@LCL
D=M
@frame
M=D
@5
D=D-A
A=D
D=M
@ret
M=D
@SP
M=M-1
A=M
D=M
@ARG
A=M
M=D
@ARG
D=M+1
@SP
M=D
@frame
D=M
@1
D=D-A
A=D
D=M
@THAT
M=D
@frame
D=M
@2
D=D-A
A=D
D=M
@THIS
M=D
@frame
D=M
@3
D=D-A
A=D
D=M
@ARG
M=D
@frame
D=M
@4
D=D-A
A=D
D=M
@LCL
M=D
@ret
A=M
0;JMP
// add Label Main.fibonacci$IF_FALSE
(Main.fibonacci$IF_FALSE)
// push argument 0
@0
D=A
@ARG
A=M
D=D+A
A=D
D=M
@SP
A=M
M=D
@SP
M=M+1
// push constant 2
@2
D=A
@SP
A=M
M=D
@SP
M=M+1
// sub
@SP
AM=M-1
D=M
@SP
AM=M-1
A=M
D=A-D
@SP
A=M
M=D
@SP
M=M+1
// call Main.fibonacci
@RETURN0
D=A
@SP
A=M
M=D
@SP
M=M+1
@LCL
D=M
@SP
A=M
M=D
@SP
M=M+1
@ARG
D=M
@SP
A=M
M=D
@SP
M=M+1
@THIS
D=M
@SP
A=M
M=D
@SP
M=M+1
@THAT
D=M
@SP
A=M
M=D
@SP
M=M+1
D=M
@1
D=D-A
@5
D=D-A
@ARG
M=D
@SP
D=M
@LCL
M=D
@Main.fibonacci
0;JMP
(RETURN0)
// push argument 0
@0
D=A
@ARG
A=M
D=D+A
A=D
D=M
@SP
A=M
M=D
@SP
M=M+1
// push constant 1
@1
D=A
@SP
A=M
M=D
@SP
M=M+1
// sub
@SP
AM=M-1
D=M
@SP
AM=M-1
A=M
D=A-D
@SP
A=M
M=D
@SP
M=M+1
// call Main.fibonacci
@RETURN1
D=A
@SP
A=M
M=D
@SP
M=M+1
@LCL
D=M
@SP
A=M
M=D
@SP
M=M+1
@ARG
D=M
@SP
A=M
M=D
@SP
M=M+1
@THIS
D=M
@SP
A=M
M=D
@SP
M=M+1
@THAT
D=M
@SP
A=M
M=D
@SP
M=M+1
D=M
@1
D=D-A
@5
D=D-A
@ARG
M=D
@SP
D=M
@LCL
M=D
@Main.fibonacci
0;JMP
(RETURN1)
// add
@SP
AM=M-1
D=M
@SP
AM=M-1
A=M
D=A+D
@SP
A=M
M=D
@SP
M=M+1
// return
@LCL
D=M
@frame
M=D
@5
D=D-A
A=D
D=M
@ret
M=D
@SP
M=M-1
A=M
D=M
@ARG
A=M
M=D
@ARG
D=M+1
@SP
M=D
@frame
D=M
@1
D=D-A
A=D
D=M
@THAT
M=D
@frame
D=M
@2
D=D-A
A=D
D=M
@THIS
M=D
@frame
D=M
@3
D=D-A
A=D
D=M
@ARG
M=D
@frame
D=M
@4
D=D-A
A=D
D=M
@LCL
M=D
@ret
A=M
0;JMP
// function Sys.init
(Sys.init)
// push constant 4
@4
D=A
@SP
A=M
M=D
@SP
M=M+1
// call Main.fibonacci
@RETURN2
D=A
@SP
A=M
M=D
@SP
M=M+1
@LCL
D=M
@SP
A=M
M=D
@SP
M=M+1
@ARG
D=M
@SP
A=M
M=D
@SP
M=M+1
@THIS
D=M
@SP
A=M
M=D
@SP
M=M+1
@THAT
D=M
@SP
A=M
M=D
@SP
M=M+1
D=M
@1
D=D-A
@5
D=D-A
@ARG
M=D
@SP
D=M
@LCL
M=D
@Main.fibonacci
0;JMP
(RETURN2)
// add Label Sys.init$WHILE
(Sys.init$WHILE)
// goto Sys.init$WHILE
@Sys.init$WHILE
0;JMP