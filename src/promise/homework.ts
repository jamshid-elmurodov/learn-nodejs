
// part 1
const whereAmI  = async (lat : string, long : string) => {
    const resGeo = await fetch(`https://geocode.xyz/${lat},${long}?geoit=json`);

    if (!resGeo.ok) {
        throw new Error(`Geocode could not be found.`);
    }

    const dataGeo = await resGeo.json();

    console.log(dataGeo);

    return dataGeo.country;
}

// part 2
const getInfoOfCountry = async (countryName : string) => {
    const res = await fetch(`https://restcountries.com/v3.1/name/${countryName}`);

    if (!res.ok) throw new Error(`Country could not be found. ${res.status}`);

    const [data] = await res.json();

    return data;
}

(async () => {
    try {
        const whereAmIRes = await whereAmI("41.311557", '69.248557');
        await getInfoOfCountry(whereAmIRes);
    } catch (err){
        console.error(err)
    }
})()