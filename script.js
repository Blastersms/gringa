document.addEventListener("DOMContentLoaded", function() {
    // Definição das variáveis de configuração
    var trackingDomain = "lozas.ttrk.io"; // Domínio de rastreamento
    var eventType = "InitiateCheckout"; // Tipo de evento

    var links = document.querySelectorAll('a');

    links.forEach(function(link) {
        link.addEventListener('click', function(event) {
            var linkUrl = link.href;
            var urlObj = new URL(linkUrl);
            
            if (urlObj.pathname.includes("/click")) {
                // 1. Tentar obter o valor do cookie 'rtkclickid-store'
                var subId = getCookie('rtkclickid-store');

                // 2. Se o cookie não for encontrado, tentar obter o parâmetro de URL
                if (!subId) {
                    subId = getSubIdFromUrl(urlObj.searchParams);
                }

                // 3. Se encontrar um subId, realizar o postback
                if (subId) {
                    var postbackUrl = "https://" + trackingDomain + "/postback?clickid=" + subId + "&type=" + eventType;
                    var img = new Image();
                    img.src = postbackUrl;
                }
            }
        });
    });

    // Função para obter o valor de um cookie pelo nome
    function getCookie(name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }

    // Função para obter o valor do parâmetro com 24 caracteres da URL
    function getSubIdFromUrl(params) {
        for (const [key, value] of params.entries()) {
            if (value.length === 24) {
                return value;
            }
        }
        return null;
    }
});

