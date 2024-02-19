export default function getISOString(date:Date){
    return date.toLocaleDateString()+"T"+date.toLocaleTimeString();
}