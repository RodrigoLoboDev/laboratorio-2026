<!-- Verificar version de git -->
git --version

<!-- Configuracion base -->
git config --global user.name "Rodrigo Lobo"
git config --global user.email "correotaller278@gmail.com"
<!-- Verificar configuracion -->
git config --list

<!-- Inicializar repositorio local -->
git init

<!-- Verificar estado del repo -->
git status

<!-- Para agregar 1 archivo -->
git add NOMBRE_DEL_ARCHIVO

<!-- Para agregar todos los archivos -->
git add .

<!-- Realizar el commit -->
git commit -m "Mi primer commit"

<!-- Ver los commit realizados -->
git log
git log --onelist
<!-- Para salir la letra "q" -->

<!-- Limpiar la consola -->
clear

<!-- Crear rama principal main -->
git branch -M main

<!-- Conectar nuestro local con el repo de la nube -->
git remote add origin URL