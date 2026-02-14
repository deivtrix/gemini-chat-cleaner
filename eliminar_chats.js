(async function eliminarChatsGeminiDefinitivoV2() {
    const dormir = (ms) => new Promise(r => setTimeout(r, ms));
    console.log("🚀 Iniciando eliminación masiva de chats (versión mejorada)...");
    
    let eliminados = 0;
    let errores = 0;
    let sinMenu = 0;
    const MAX_ITERACIONES = 500; // Límite de seguridad
    
    // Función para encontrar todos los botones de menú (3 puntos)
    function encontrarBotonesMenu() {
        // Buscar en la lista de conversaciones
        const conversaciones = document.querySelectorAll('div[class*="conversation"]');
        const botones = [];
        const botonesProcesados = new Set();
        
        for (const conv of conversaciones) {
            // Buscar botones dentro de la conversación que podrían ser el menú
            const botonesEnConv = conv.querySelectorAll('button');
            for (const btn of botonesEnConv) {
                // Verificar si es un botón de menú (suele ser pequeño y tener icono)
                if (btn.offsetWidth > 0 && btn.offsetHeight > 0 &&
                    (btn.innerHTML.includes('svg') || 
                     btn.className.includes('menu') ||
                     btn.getAttribute('aria-label')?.includes('menu') ||
                     btn.getAttribute('mat-icon-button') !== null)) {
                    
                    // Verificar que no esté ya procesado
                    if (!btn.hasAttribute('data-procesado')) {
                        botones.push(btn);
                    }
                    break; // Solo un botón por conversación
                }
            }
        }
        
        return botones;
    }
    
    // Función para esperar a que aparezca el menú
    async function esperarMenu(maxIntentos = 10) {
        for (let i = 0; i < maxIntentos; i++) {
            // Buscar el menú en diferentes posibles contenedores
            const menu = document.querySelector(
                'div[class*="cdk-overlay-pane"], ' +
                'div[role="menu"], ' +
                '.mat-mdc-menu-panel, ' +
                'div[class*="menu-panel"]'
            );
            
            if (menu && menu.offsetWidth > 0 && menu.offsetHeight > 0) {
                // Verificar que el menú tenga opciones
                const opciones = menu.querySelectorAll('button, [role="menuitem"]');
                if (opciones.length > 0) {
                    return menu;
                }
            }
            await dormir(200);
        }
        return null;
    }
    
    // Función para hacer scroll y cargar más chats
    async function cargarMasChats() {
        const contenedorScroll = document.querySelector(
            'div[class*="chat-history"], ' +
            'div[class*="scroll"], ' +
            '.conversations-list, ' +
            'div[style*="overflow"]'
        );
        
        if (contenedorScroll) {
            const scrollHeight = contenedorScroll.scrollHeight;
            contenedorScroll.scrollTop = scrollHeight;
            console.log("📜 Scrolling para cargar más chats...");
            await dormir(2000);
            
            // Verificar si realmente se cargaron más
            const nuevoScrollHeight = contenedorScroll.scrollHeight;
            return nuevoScrollHeight > scrollHeight;
        }
        return false;
    }
    
    console.log("🔍 Buscando chats para eliminar...");
    
    while (eliminados < MAX_ITERACIONES) {
        // Encontrar todos los botones de menú disponibles
        let botonesMenu = encontrarBotonesMenu();
        
        if (botonesMenu.length === 0) {
            // Si no hay más botones, intentar cargar más chats
            const cargoMas = await cargarMasChats();
            
            if (cargoMas) {
                botonesMenu = encontrarBotonesMenu();
            }
            
            if (botonesMenu.length === 0) {
                console.log("✨ No se encontraron más chats para eliminar");
                break;
            }
        }
        
        console.log(`📊 Botones de menú encontrados: ${botonesMenu.length}`);
        
        // Procesar cada botón de menú
        for (let i = 0; i < botonesMenu.length; i++) {
            try {
                const botonMenu = botonesMenu[i];
                
                // Verificar que el botón sigue siendo válido
                if (!botonMenu || botonMenu.offsetWidth === 0) {
                    continue;
                }
                
                // Marcar como procesado
                botonMenu.setAttribute('data-procesado', 'true');
                
                // Scroll al botón
                botonMenu.scrollIntoView({ block: 'center', behavior: 'smooth' });
                await dormir(500);
                
                console.log(`🔄 Procesando chat ${eliminados + 1}...`);
                
                // Hacer clic en el botón de menú
                botonMenu.click();
                
                // Esperar a que aparezca el menú
                const menuOverlay = await esperarMenu(15); // 15 intentos de 200ms = 3 segundos máximo
                
                if (!menuOverlay) {
                    console.log("⚠️ No apareció el menú, reintentando...");
                    // Intentar cerrar cualquier menú abierto
                    document.body.click();
                    await dormir(500);
                    
                    // Reintentar el clic
                    botonMenu.click();
                    await dormir(1000);
                    
                    const menuReintento = await esperarMenu(10);
                    if (!menuReintento) {
                        console.log("❌ No se pudo abrir el menú");
                        sinMenu++;
                        continue;
                    }
                }
                
                // Buscar la opción "Delete" dentro del menú
                const opciones = menuOverlay.querySelectorAll(
                    'button[mat-menu-item], ' +
                    '.mat-mdc-menu-item, ' +
                    'button[role="menuitem"], ' +
                    'div[role="menuitem"]'
                );
                
                let botonEliminar = null;
                for (const opcion of opciones) {
                    const texto = opcion.textContent?.trim().toLowerCase();
                    if (texto === 'delete' || texto.includes('eliminar') || texto.includes('borrar')) {
                        botonEliminar = opcion;
                        break;
                    }
                }
                
                if (!botonEliminar) {
                    console.log("⚠️ No se encontró la opción Delete");
                    document.body.click(); // Cerrar menú
                    sinMenu++;
                    continue;
                }
                
                console.log("✅ Opción Delete encontrada, haciendo clic...");
                botonEliminar.click();
                await dormir(1000);
                
                // Buscar botón de confirmación
                const botonesConfirmacion = Array.from(document.querySelectorAll('button'))
                    .filter(btn => {
                        if (btn.offsetWidth === 0) return false;
                        const texto = btn.textContent?.trim().toLowerCase();
                        return (texto === 'delete' || texto.includes('eliminar') || texto.includes('confirmar')) && 
                               btn.offsetWidth > 0;
                    });
                
                if (botonesConfirmacion.length > 0) {
                    console.log("✅ Confirmando eliminación...");
                    botonesConfirmacion[0].click();
                    eliminados++;
                    console.log(`🎉 Chat eliminado correctamente! Total: ${eliminados}`);
                    await dormir(1500);
                } else {
                    console.log("⚠️ No se encontró botón de confirmación");
                    document.body.click();
                }
                
                // Pequeña pausa entre cada eliminación
                await dormir(800);
                
            } catch (error) {
                console.error("❌ Error:", error);
                document.body.click(); // Intentar cerrar menús abiertos
                errores++;
                await dormir(1000);
            }
        }
        
        // Pequeña pausa entre iteraciones
        await dormir(1500);
    }
    
    console.log("\n" + "=".repeat(50));
    console.log("📊 RESUMEN FINAL:");
    console.log(`✅ Chats eliminados: ${eliminados}`);
    console.log(`⚠️ Chats sin menú: ${sinMenu}`);
    console.log(`❌ Errores: ${errores}`);
    console.log("=".repeat(50));
    
    if (eliminados === 0) {
        console.log("\n💡 Si no se eliminó ningún chat:");
        console.log("1. Asegúrate de estar en la vista principal de Gemini");
        console.log("2. Espera a que cargue la lista completa de chats");
        console.log("3. Prueba haciendo scroll manual primero");
        console.log("4. Verifica que los chats tengan el botón de 3 puntos");
    } else {
        console.log(`\n🎉 Éxito! Se eliminaron ${eliminados} chats. El script puede seguir corriendo para eliminar más.`);
    }
})();
