document.addEventListener('DOMContentLoaded', function() {
    // --- Lógica para sugerencias de municipalidades ---
    const municipalidadInput = document.getElementById('municipalidad');
    const sugerenciasMunicipalidadesDatalist = document.getElementById('sugerenciasMunicipalidades');

    // Función para inicializar las sugerencias de municipalidades desde la imagen
    function inicializarSugerenciasMunicipalidades() {
        let sugerenciasGuardadas = JSON.parse(localStorage.getItem('municipalidadesSugerencias')) || [];

        // Opciones de municipalidades obtenidas de la imagen adjunta
        const opcionesMunicipalidades = [
            "ESCUINTLA", "MASAGUA", "GUANAGAZAPA", "LA DEMOCRACIA", "LA GOMERA", "SIPACATE",
            "TAXISCO", "PUERTO IZAPA", "PUERTO DE SAN JOSÉ", "SIQUINALA",
            "SANTA LUCIA COTZUMALGUAPA", "PALIN", "SAN VICENTE PACAYA",
            "SAN LUCAS SACATEPEQUEZ", "SANTIAGO SACATEPEQUEZ", "SANTO DOMINGO XENACOJ",
            "SUMPANGO", "SANTA LUCIA MILPAS ALTAS", "SAN BARTOLOME MILPAS ALTAS",
            "MAGDALENA MILPAS ALTAS", "JOCOTENANGO", "SAN ANDRES ITZAPA", "PASTORES",
            "CIUDAD VIEJA", "SANTA CATARINA BARAHONA", "SAN ANTONIO AGUAS CALIENTES",
            "SAN JUAN ALOTENANGO", "SAN MIGUEL DUEÑAS", "SANTA MARIA DE JESUS",
            "ANTIGUA GUATEMALA", "GUATEMALA", "SAN JUAN SACATEPEPEQUEZ", "MIXCO",
            "SAN JOSE DEL GOLFO", "PALENCIA", "SAN PEDRO AYAMPUC", "CHUARRANCHO",
            "SAN PEDRO SACATEPEQUEZ", "SAN RAYMUNDO", "SAN JOSE PINULA", "FRAIJANES",
            "SANTA CATARINA PINULA", "VILLA CANALES", "AMATITLAN", "SAN MIGUEL PETAPA",
            "VILLA NUEVA"
        ];

        // Añadir solo las opciones de municipalidades que no estén ya en sugerenciasGuardadas
        opcionesMunicipalidades.forEach(opcion => {
            if (!sugerenciasGuardadas.includes(opcion)) {
                sugerenciasGuardadas.push(opcion);
            }
        });

        localStorage.setItem('municipalidadesSugerencias', JSON.stringify(sugerenciasGuardadas));
    }

    // Función para cargar sugerencias de municipalidades desde localStorage al datalist
    function cargarSugerenciasMunicipalidades() {
        const sugerenciasGuardadas = JSON.parse(localStorage.getItem('municipalidadesSugerencias')) || [];
        sugerenciasMunicipalidadesDatalist.innerHTML = ''; // Limpiar opciones existentes
        sugerenciasGuardadas.forEach(sugerencia => {
            const option = document.createElement('option');
            option.value = sugerencia;
            sugerenciasMunicipalidadesDatalist.appendChild(option);
        });
    }

    // Función para guardar nuevas sugerencias de municipalidades (si el usuario ingresa una nueva)
    function guardarSugerenciaMunicipalidad(nuevaSugerencia) {
        if (!nuevaSugerencia || nuevaSugerencia.trim() === "") return;

        let sugerenciasGuardadas = JSON.parse(localStorage.getItem('municipalidadesSugerencias')) || [];
        if (!sugerenciasGuardadas.includes(nuevaSugerencia)) {
            sugerenciasGuardadas.push(nuevaSugerencia);
            localStorage.setItem('municipalidadesSugerencias', JSON.stringify(sugerenciasGuardadas));
            cargarSugerenciasMunicipalidades(); // Recargar el datalist
        }
    }

    // Iniciar: Asegurar que las opciones de municipalidades HTML estén en localStorage y luego cargar todo
    inicializarSugerenciasMunicipalidades();
    cargarSugerenciasMunicipalidades();

    // Guardar la sugerencia cuando el usuario salga del input de municipalidad
    municipalidadInput.addEventListener('blur', () => {
        guardarSugerenciaMunicipalidad(municipalidadInput.value.trim());
    });

    // Opcional: Guardar también al presionar Enter en el input de municipalidad
    municipalidadInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            guardarSugerenciaMunicipalidad(municipalidadInput.value.trim());
        }
    });

    // --- Total de dispositivos ---
    const quantityInputs = document.querySelectorAll('.quantity-input');
    const totalDispositivosSpan = document.getElementById('totalDispositivos');

    function calcularTotal() {
        let total = 0;
        quantityInputs.forEach(input => {
            total += parseInt(input.value) || 0;
        });
        totalDispositivosSpan.textContent = total;
    }

    quantityInputs.forEach(input => {
        input.addEventListener('input', calcularTotal);
    });

    calcularTotal(); // Calcular el total inicial

    // Limitar dpiCle a 13 dígitos numéricos
    document.getElementById('dpiCle').addEventListener('input', function(e) {
        this.value = this.value.replace(/\D/g, '').slice(0, 13);
    });

    // Limitar movil a 8 dígitos numéricos
    document.getElementById('movil').addEventListener('input', function(e) {
        this.value = this.value.replace(/\D/g, '').slice(0, 8);
    });

    // Configurar la fecha y hora actual por defecto
    const fechaActual = new Date().toISOString().split('T')[0];
    document.getElementById('fechaReporte').value = fechaActual;
    const ahora = new Date();
    const horas = ahora.getHours().toString().padStart(2, '0');
    const minutos = ahora.getMinutes().toString().padStart(2, '0');
    document.getElementById('horaReporte').value = `${horas}:${minutos}`;

    // --- Lógica para firmas con modal ---
    let signaturePad;
    let currentSignatureTarget = null;

    document.querySelectorAll('.edit-signature-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            currentSignatureTarget = this.dataset.target;
            document.getElementById('signatureModal').style.display = 'flex';
            const canvas = document.getElementById('modalSignatureCanvas');

            // Ajustar el tamaño real del canvas al tamaño mostrado en pantalla
            function resizeCanvas() {
                const rect = canvas.getBoundingClientRect();
                canvas.width = rect.width;
                canvas.height = rect.height;
            }
            resizeCanvas();

            // Inicializar SignaturePad después de ajustar el tamaño
            signaturePad = new window.SignaturePad(canvas, {
                minWidth: 2,
                maxWidth: 4,
                penColor: 'rgb(43,108,167)'
            });

            // Si ya hay firma previa, cargarla en el canvas
            const imgData = document.getElementById(currentSignatureTarget + 'Data').value;
            if (imgData) {
                const img = new window.Image();
                img.onload = function() {
                    signaturePad.clear();
                    const ctx = canvas.getContext('2d');
                    ctx.clearRect(0,0,canvas.width,canvas.height);
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                };
                img.src = imgData;
            } else {
                signaturePad.clear();
            }
        });
    });

    document.getElementById('clearModalSignature').onclick = function() {
        signaturePad.clear();
    };

    document.getElementById('closeModalSignature').onclick = function() {
        document.getElementById('signatureModal').style.display = 'none';
    };

    document.getElementById('saveModalSignature').onclick = function() {
        if (!signaturePad.isEmpty()) {
            const dataUrl = signaturePad.toDataURL();
            document.getElementById(currentSignatureTarget + 'Img').src = dataUrl;
            document.getElementById(currentSignatureTarget + 'Img').style.display = 'block';
            document.getElementById(currentSignatureTarget + 'Data').value = dataUrl;
        } else {
            document.getElementById(currentSignatureTarget + 'Img').src = '';
            document.getElementById(currentSignatureTarget + 'Img').style.display = 'none';
            document.getElementById(currentSignatureTarget + 'Data').value = '';
        }
        document.getElementById('signatureModal').style.display = 'none';
    };

    // --- Contador de caracteres para observaciones ---
    const observacionesTextarea = document.getElementById('observaciones');
    const contadorObservaciones = document.getElementById('contadorObservaciones');
    if (observacionesTextarea && contadorObservaciones) {
        function actualizarContador() {
            contadorObservaciones.textContent = `${observacionesTextarea.value.length}/165`;
        }
        observacionesTextarea.addEventListener('input', function() {
            if (this.value.length > 165) {
                this.value = this.value.slice(0, 165);
            }
            actualizarContador();
        });
        actualizarContador();
    }

    //Convertir todo en mayusculas
    const inputsToUpper = document.querySelectorAll('#acompananteMunicipal, #municipalidad, #cargoMunicipal, #observaciones');
    inputsToUpper.forEach(input => {
        input.addEventListener('input', function() {
            this.value = this.value.toUpperCase();
        });
    });

    // --- Función para enviar datos a Google Sheets ---
    async function enviarDatosAGoogleSheets() {
        // Validar campos obligatorios
        const oficialInventario = document.getElementById('oficialInventario').value;
        const fechaReporte = document.getElementById('fechaReporte').value;
        const horaReporte = document.getElementById('horaReporte').value;
        const municipalidad = document.getElementById('municipalidad').value;
        const acompananteMunicipal = document.getElementById('acompananteMunicipal').value;
        const firmaOficialData = document.getElementById('firmaOficialData').value;

        if (!oficialInventario || !fechaReporte || !horaReporte || !municipalidad) {
            alert('Por favor complete los campos obligatorios: Oficial de Inventario, Fecha, Hora de Reporte y Municipalidad');
            return false;
        }
        if (!acompananteMunicipal) {
            alert('Por favor ingrese el nombre del acompañante municipal.');
            return false;
        }
        if (!firmaOficialData) {
            alert('Por favor agregue la firma del Oficial de Inventario (GAUSS).');
            return false;
        }

        // --- Obtener imágenes de firmas en base64 ---
        // Si no hay firma, será cadena vacía
        function getImgBase64ById(imgId) {
            const img = document.getElementById(imgId);
            if (img && img.src && img.style.display !== 'none') {
                return img.src;
            }
            return '';
        }
        const firmaAcompananteImgBase64 = getImgBase64ById('firmaAcompananteImg');
        const firmaOficialImgBase64 = getImgBase64ById('firmaOficialImg');

        // Recolectar todos los datos del formulario en un objeto FormData
        const formData = new URLSearchParams(); // Usar URLSearchParams para codificar como x-www-form-urlencoded
        formData.append('Oficial_Inventario', oficialInventario);
        formData.append('Fecha_Reporte', fechaReporte);
        formData.append('Hora_Reporte', horaReporte);
        formData.append('Camaras', document.getElementById('cantCamaras').value || '');
        formData.append('Cronometros', document.getElementById('cantCronometros').value || '');
        formData.append('Direccionales', document.getElementById('cantDireccionales').value || '');
        formData.append('Lamparas', document.getElementById('cantLamparas').value || '');
        formData.append('Mupis', document.getElementById('cantMupis').value || '');
        formData.append('Ornamentales', document.getElementById('cantOrnamentales').value || '');
        formData.append('Pantalla_Informativa', document.getElementById('cantPantallasInformativas').value || '');
        formData.append('Parada_Transmetro', document.getElementById('cantParadaTransmetro').value || '');
        formData.append('Parada_Transurbano', document.getElementById('cantParadaTransurbano').value || '');
        formData.append('Reflectores', document.getElementById('cantReflectores').value || '');
        formData.append('Semaforos', document.getElementById('cantSemaforos').value || '');
        formData.append('Vallas_Publicitarias', document.getElementById('cantVallasPublicitarias').value || '');
        formData.append('WalPack', document.getElementById('cantWalPak').value || '');
        formData.append('Total_Dispositivos', document.getElementById('totalDispositivos').textContent);
        formData.append('Acompanante_Municipal', acompananteMunicipal || 'SIN ACOMPAÑAMIENTO MUNICIPAL');
        formData.append('DPI', document.getElementById('dpiCle').value || '');
        formData.append('Movil', document.getElementById('movil').value || '');
        formData.append('Municipalidad', municipalidad);
        formData.append('Cargo_Municipal', document.getElementById('cargoMunicipal').value || '');
        formData.append('Observaciones', document.getElementById('observaciones').value || '');
        formData.append('FechaCreacion', new Date().toISOString());

        // Agregar firmas en base64
        formData.append('FirmaMuni', firmaAcompananteImgBase64 || 'SIN FIRMA');
        formData.append('FirmaGauss', firmaOficialImgBase64 || 'SIN FIRMA');
        
        // try {
            // Mostrar mensaje de carga
            const submitBtn = document.getElementById('submitAndDownloadBtn');
            const originalText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.textContent = 'Enviando datos...';

            // URL de tu Web App de Google Apps Script
            const scriptUrl = 'https://script.google.com/macros/s/AKfycbynFz2Ko76HAdEO0fKWeweYYGEFaFGgmiFrcASFYfmBlKsr371T8LYuh9ovir37-6g/exec';

            const response = await fetch(scriptUrl, {
                method: 'POST',
                // No necesitamos 'Content-Type': 'application/json'
                // fetch con URLSearchParams automáticamente establece 'Content-Type': 'application/x-www-form-urlencoded'
                body: formData // Enviar como URLSearchParams
            });
            //const submitBtn = document.getElementById('submitAndDownloadBtn');
            submitBtn.disabled = false;
            submitBtn.textContent = originalText; // Restaurar el texto original del botón
            // Verificar si la solicitud fue exitosa
            // if (!response.ok) {
            //     throw new Error(`Error HTTP: ${response.status}`);
            // }

            // // Si la función doPost en Apps Script devuelve "OK" como texto simple,
            // // podemos verificarlo así:
            // const responseText = await response.text();
            // if (responseText === "OK") {
            //     console.log('Datos enviados correctamente a Google Sheets');
            //     return true;
            // } else {
            //     console.error('Error al enviar datos: Respuesta inesperada del servidor:', responseText);
            //     alert('Ocurrió un error al enviar los datos. Respuesta del servidor: ' + responseText);
            //     return false;
            // }
        // } catch (error) {
        //     console.error('Error al enviar datos:', error);
        //     alert('Ocurrió un error al enviar los datos. Por favor intente nuevamente.');
        //     return false;
        // } finally {
        //     const submitBtn = document.getElementById('submitAndDownloadBtn');
        //     submitBtn.disabled = false;
        //     submitBtn.textContent = originalText; // Restaurar el texto original del botón
        // }
    }

    // --- Función para generar PDF ---
    function generarPDF() {
        const { jsPDF } = window.jspdf;
        const element = document.getElementById('printableArea');
        const downloadBtn = document.getElementById('submitAndDownloadBtn');

        // Ocultar botones de editar/Agregar firma
        const editSignatureBtns = document.querySelectorAll('.edit-signature-btn');
        editSignatureBtns.forEach(btn => btn.style.display = 'none');

        // Reemplazar los inputs de fecha y hora por spans temporales
        const fechaInput = document.getElementById('fechaReporte');
        const horaInput = document.getElementById('horaReporte');
        const fechaSpan = document.createElement('span');
        fechaSpan.textContent = fechaInput.value;
        fechaSpan.style.font = "inherit";
        fechaSpan.style.padding = "2px 4px";
        fechaSpan.style.borderBottom = "1px solid #000";

        const horaSpan = document.createElement('span');
        horaSpan.textContent = horaInput.value;
        horaSpan.style.font = "inherit";
        horaSpan.style.padding = "2px 4px";
        horaSpan.style.borderBottom = "1px solid #000";

        fechaInput.parentNode.replaceChild(fechaSpan, fechaInput);
        horaInput.parentNode.replaceChild(horaSpan, horaInput);

        // Ocultar placeholders temporalmente
        const inputs = element.querySelectorAll('input[placeholder], textarea[placeholder]');
        const placeholders = [];
        inputs.forEach(input => {
            placeholders.push({ el: input, placeholder: input.placeholder });
            input.placeholder = '';
        });

        // Reemplazar textarea de observaciones por un div temporal con saltos de línea
        const observacionesTextarea = document.getElementById('observaciones');
        let observacionesDiv;
        if (observacionesTextarea) {
            observacionesDiv = document.createElement('div');
            observacionesDiv.style.whiteSpace = 'pre-line';
            observacionesDiv.style.textAlign = 'justify';
            observacionesDiv.style.minHeight = observacionesTextarea.offsetHeight + 'px';
            observacionesDiv.style.border = observacionesTextarea.style.border;
            observacionesDiv.style.padding = observacionesTextarea.style.padding;
            observacionesDiv.textContent = observacionesTextarea.value;
            observacionesTextarea.parentNode.replaceChild(observacionesDiv, observacionesTextarea);
        }

        // Ocultar el botón de descarga
        downloadBtn.style.display = 'none';

        html2canvas(element, {
            scale: 2,
            logging: false,
            useCORS: true,
            allowTaint: true
        }).then(canvas => {
            // Convertir a JPEG con calidad 0.5 para máxima compresión
            const imgData = canvas.toDataURL('image/jpeg', 0.5);
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgWidth = 210;
            const imgHeight = canvas.height * imgWidth / canvas.width;

            pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight);
            pdf.save('Bitacora_Inventario_' + new Date().toISOString().slice(0, 10) + '.pdf');
        }).finally(() => {
            // Restaurar los inputs originales
            fechaSpan.parentNode.replaceChild(fechaInput, fechaSpan);
            horaSpan.parentNode.replaceChild(horaInput, horaSpan);

            // Restaurar placeholders
            placeholders.forEach(obj => {
                obj.el.placeholder = obj.placeholder;
            });

            // Restaurar el textarea de observaciones
            if (observacionesDiv && observacionesDiv.parentNode) {
                observacionesDiv.parentNode.replaceChild(observacionesTextarea, observacionesDiv);
            }

            // Mostrar el botón de descarga nuevamente
            downloadBtn.style.display = '';

            // Mostrar los botones de editar/Agregar firma nuevamente
            editSignatureBtns.forEach(btn => btn.style.display = '');
        });
    }

    // --- Función para consultar datos en Google Sheets y cargar en el formulario ---
async function consultarYcargarDatosDesdeSheets(nombre, fecha) {
    // URL de tu Web App de Google Apps Script para consulta
    const scriptUrl = 'https://script.google.com/macros/s/AKfycbxmdVHaWGE7wlklrCervZPCdLSwVJCeq-FwWgkJUMPZgfidjsi3rkdNCqD2a3QIeX00/exec';
    
    // Construir la URL con parámetros de consulta (ya no necesita 'consulta=1')
    const url = `${scriptUrl}?Oficial_Inventario=${encodeURIComponent(nombre)}&Fecha_Reporte=${encodeURIComponent(fecha)}`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Error en la respuesta del servidor');
        const data = await response.json();

        // Verificar si hay un error o si no se encontró el registro
        if (data.error) {
            alert(data.error);
            return;
        }

        // Si llegamos aquí, tenemos datos válidos
        // Cargar los datos en el formulario (ajusta los nombres según tu estructura)
        
        // Datos básicos
        document.getElementById('oficialInventario').value = data.oficial_inventario || '';
        //document.getElementById('fechaReporte').value = data.fecha_reporte || ''; //NO USAR
        //document.getElementById('horaReporte').value = data.hora_reporte || ''; //NO USAR
        
        // Cantidades de dispositivos
        document.getElementById('cantCamaras').value = data.camaras || '';
        document.getElementById('cantCronometros').value = data.cronometros || '';
        document.getElementById('cantDireccionales').value = data.direccionales || '';
        document.getElementById('cantLamparas').value = data.lamparas || '';
        document.getElementById('cantMupis').value = data.mupis || '';
        document.getElementById('cantOrnamentales').value = data.ornamentales || '';
        document.getElementById('cantPantallasInformativas').value = data.pantalla_informativa || '';
        document.getElementById('cantParadaTransmetro').value = data.parada_transmetro || '';
        document.getElementById('cantParadaTransurbano').value = data.parada_transurbano || '';
        document.getElementById('cantReflectores').value = data.reflectores || '';
        document.getElementById('cantSemaforos').value = data.semaforos || '';
        document.getElementById('cantVallasPublicitarias').value = data.vallas_publicitarias || '';
        document.getElementById('cantWalPak').value = data.walpack || '';
        //document.getElementById('totalDispositivos').textContent = data.total_dispositivos || '0';
        
        // Información adicional
        document.getElementById('acompananteMunicipal').value = data.acompanante_municipal || '';
        document.getElementById('dpiCle').value = data.dpi || '';
        document.getElementById('movil').value = data.movil || '';
        document.getElementById('municipalidad').value = data.municipalidad || '';
        document.getElementById('cargoMunicipal').value = data.cargo_municipal || '';
        document.getElementById('observaciones').value = data.observaciones || '';

        // Firmas (si existen en base64)
        if (data.firmamuni) {
            let firmaMuniSrc = data.firmamuni;
            if (!firmaMuniSrc.startsWith('data:image')) {
                firmaMuniSrc = 'data:image/png;base64,' + firmaMuniSrc;
            }
            document.getElementById('firmaAcompananteImg').src = firmaMuniSrc;
            document.getElementById('firmaAcompananteImg').style.display = 'block';
            document.getElementById('firmaAcompananteData').value = firmaMuniSrc;
        }
        if (data.firmagauss) {
            let firmaGaussSrc = data.firmagauss;
            if (!firmaGaussSrc.startsWith('data:image')) {
                firmaGaussSrc = 'data:image/png;base64,' + firmaGaussSrc;
            }
            document.getElementById('firmaOficialImg').src = firmaGaussSrc;
            document.getElementById('firmaOficialImg').style.display = 'block';
            document.getElementById('firmaOficialData').value = firmaGaussSrc;
        }

        // Actualizar el total de dispositivos
        calcularTotal();

        alert('Datos cargados correctamente. Puede editarlos si es necesario.');
        
    } catch (err) {
        console.error('Error al consultar Google Sheets:', err);
        alert('Error al consultar los datos: ' + err.message);
    }
}

function setupSearchEvents() {
    const nombreInput = document.getElementById('oficialInventario');
    const fechaInput = document.getElementById('fechaReporte');

    // Solo activar búsqueda cuando cambia la fecha
    fechaInput.addEventListener('change', function() {
        const nombre = nombreInput.value.trim();
        const fecha = fechaInput.value;
        if (nombre && fecha) {
            console.log('Buscando:', nombre, fecha);
            consultarYcargarDatosDesdeSheets(nombre, fecha);
        }
    });
}

// Ejecutar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupSearchEvents);
} else {
    setupSearchEvents();
}

    // --- Evento principal del botón ---
    document.getElementById('submitAndDownloadBtn').addEventListener('click', async function(e) {
        e.preventDefault();

        const submitBtn = this;
        // Bloquear el botón para evitar envíos dobles
        if (submitBtn.disabled) return; // Si ya está deshabilitado, no hacer nada

        submitBtn.disabled = true;
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Enviando datos...';

        // Primero enviar datos a Google Sheets
        const envioExitoso = await enviarDatosAGoogleSheets();

        // Restaurar el botón después del envío
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;

        // Solo generar PDF si el envío fue exitoso (descomenta si lo necesitas)
        // if (envioExitoso) {
        generarPDF();
        //}
    });
});
