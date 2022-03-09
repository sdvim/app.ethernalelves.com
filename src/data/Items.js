import AuraOfImmunity from "../assets/items/aura-of-immunity.png";
import DemonicRupture from "../assets/items/demonic-rupture.png";
import MidasRing from "../assets/items/midas-ring.png";
import MoonElixir from "../assets/items/moon-elixir.png";
import SpiritBand from "../assets/items/spirit-band.png";
import TalismanOfEnragement from "../assets/items/talisman-of-enragement.png";

const items = [
  {
    text: "Empty",
    hidden: true,
  },
  {
    text: "Talisman of Enragement",
    description: "Doubles total attack points",
    image: TalismanOfEnragement,
  },
  {
    text: "Moon Elixir",
    description: "Increases HP by 50%",
    image: MoonElixir,
  },
  {
    text: "Midas Ring",
    description: "Doubles rewarded $REN",
    image: MidasRing,
  },
  {
    text: "Spirit Band",
    description: "Doubles gained levels",
    image: SpiritBand,
  },
  {
    text: "Aura of Immunity",
    description: "Eliminates regeneration",
    image: AuraOfImmunity,
  },
  {
    text: "Demonic Rupture",
    description: "Triples total attack points",
    image: DemonicRupture,
  },
];

export default items;