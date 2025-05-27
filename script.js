/*Parsitaan alueet*/ 
fetch("https://www.finnkino.fi/xml/TheatreAreas/")
    .then(response => response.text())
    .then(str => {
        const parser = new DOMParser();
        const xml = parser.parseFromString(str, "text/xml");
        const alueet = xml.querySelectorAll("TheatreArea");
        //Haetaan teatteri tiedot, luodaan muuttuja parserille, joka muuttaa tiedot DOM:ksi, luodaan muuttuja, jossa on DOM muodossa tagin sisallot.//
        
        

        /**Luodaan valikkoon sisältö */

        const $select = $("#valikko");
        /**Käydään läpi ID:t ja nimet */
        alueet.forEach((area, index) => {
            if (index === 0) return; //ohitetaan ensimmäinen arvo, joka on tyhjä XML tiedostossa

            const id=area.querySelector("ID").textContent;
            const nimi = area.querySelector("Name").textContent;

            $("<option>") //Luodaan sisältöä valikkoon, arvo = id, käyttäjälle nimi näkyvissä, lisäys.
                .val(id)
                .text(nimi)
                .appendTo($select);

         
        });
    });



    $("#valikko").on("change", function() { //Kuuntelija valikon muutoksille. 
        const theatreId = $(this).val(); //Haetaan ja näytetään valitun teatterin näytökset.

        if (!theatreId) { //Jos --Valitse teatteri-- valittuna, API kutsua ei tehdä, joten se tyhjentää näytöskentän
            $("#näytökset").empty();
            return;
        }
    


        /*Parsitaan tiedot teatteri id:n mukaan*/
    fetch(`https://www.finnkino.fi/xml/Schedule/?area=${theatreId}`)
        .then(response => response.text())
        .then(str => {
            const parser = new DOMParser();
            const xml = parser.parseFromString(str, "text/xml");
            const leffat = xml.querySelectorAll("Show");

            const $leffataulukko = $("#näytökset"); 
            $leffataulukko.empty();
        
            leffat.forEach(show => { //Käydään tiedot läpi ja luodaan Bootsrap-kortti
                const kuva = show.querySelector("EventMediumImagePortrait").textContent;
                const nimi = show.querySelector("Title").textContent;
                const aika = show.querySelector("dttmShowStart").textContent;
                const sali = show.querySelector("TheatreAndAuditorium").textContent;
                const  linkki = show.querySelector("ShowURL").textContent;

              /*Bootstrap*/ 

                const $div = $(`
                    <div class="card">
                        <img src="${kuva}" class="card-img-top" alt="${nimi}">
                        <div style="padding: 1rem;">
                        <h5>${nimi}</h5>
                        <p>${sali}<br>${new Date(aika).toLocaleString()}</p>
                        <a href="${linkki}" target="_blank" class="btn btn-warning">Osta liput</a>
                        </div>
                    </div>
                    `);


                    /**Lisätään kortti */
                $leffataulukko.append($div);
                

            

            });

        });

});

/*jQuery  kirjastosta nappi, joka piilottaa / näyttää esitykset */

$("#piilotaNappi").on("click", function () {
    $("#näytökset").fadeToggle();
});