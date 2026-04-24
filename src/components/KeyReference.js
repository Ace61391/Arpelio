'use client';

// Labeled reference diagrams — shows all keys in "open" state with names
// Uses exact geometry from locked templates, adds text labels

const LABEL_STYLE = { fontSize: '10px', fontFamily: 'system-ui', fontWeight: 600, fill: '#4f46b8' };
const SUB_STYLE = { fontSize: '8px', fontFamily: 'system-ui', fontWeight: 400, fill: '#888' };
const LEAD_STYLE = { stroke: '#4f46b8', strokeWidth: 0.5, strokeDasharray: '2 2' };

function FluteReference() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 820 320" style={{display:'block'}}>
      <style>{`.open{fill:none;stroke:#000;stroke-width:3;stroke-linecap:round;stroke-linejoin:round}.divider{stroke:#000;stroke-width:3;stroke-linecap:round}`}</style>

      {/* Geometry — exact from locked template */}
      <circle className="open" cx="93" cy="156" r="31"/>
      <circle className="open" cx="183" cy="156" r="31"/>
      <circle className="open" cx="273" cy="156" r="31"/>
      <line className="divider" x1="329" y1="124" x2="329" y2="186"/>
      <circle className="open" cx="385" cy="156" r="31"/>
      <circle className="open" cx="475" cy="156" r="31"/>
      <circle className="open" cx="565" cy="156" r="31"/>
      <path className="open" d="M252 50 C238 50 230 58 230 70 C230 84 242 94 260 94 L288 94 C292 94 294 92 294 88 L294 76 C294 60 280 50 252 50 Z"/>
      <g transform="rotate(90, 93, 226)"><path className="open" d="M86 211 C76 211 73 218 73 226 C73 236 80 241 92 241 C107 241 113 234 113 225 C113 215 105 211 86 211 Z"/></g>
      <path className="open" d="M144 215 C136 217 130 224 130 231 C130 242 140 248 158 249 L195 249 C219 249 230 241 230 231 C230 220 218 213 193 213 L163 213 C154 213 148 214 144 215 Z"/>
      <ellipse className="open" cx="347" cy="221" rx="9" ry="16"/>
      <ellipse className="open" cx="430" cy="210" rx="9" ry="16"/>
      <ellipse className="open" cx="520" cy="210" rx="9" ry="16"/>
      <path className="open" d="M648 195 C643 195 640 191 638 184 C636 174 636 162 638 150 C640 142 643 134 647 130 C649 128 652 128 654 131 C656 135 656 142 656 150 L656 200 C656 189 655 194 651 195 Z"/>
      <rect className="open" x="681" y="127" width="36" height="10" rx="5" ry="5"/>
      <rect className="open" x="681" y="149" width="36" height="10" rx="5" ry="5"/>
      <path className="open" d="M694 168 C685 168 681 174 681 181 C681 189 688 195 700 195 L712 195 C724 195 729 189 729 181 C729 173 724 168 712 168 Z"/>

      {/* Labels — above */}
      <text style={LABEL_STYLE} x="262" y="40" textAnchor="middle">Bb lever</text>
      <text style={LABEL_STYLE} x="93" y="105" textAnchor="middle">LH1</text>
      <text style={LABEL_STYLE} x="183" y="105" textAnchor="middle">LH2</text>
      <text style={LABEL_STYLE} x="273" y="105" textAnchor="middle">LH3</text>
      <text style={LABEL_STYLE} x="385" y="105" textAnchor="middle">RH1</text>
      <text style={LABEL_STYLE} x="475" y="105" textAnchor="middle">RH2</text>
      <text style={LABEL_STYLE} x="565" y="105" textAnchor="middle">RH3</text>

      {/* Labels — below */}
      <text style={LABEL_STYLE} x="93" y="280" textAnchor="middle">G#</text>
      <text style={LABEL_STYLE} x="180" y="280" textAnchor="middle">Thumb</text>
      <text style={SUB_STYLE} x="180" y="292" textAnchor="middle">(B natural)</text>
      <text style={LABEL_STYLE} x="347" y="258" textAnchor="middle">D# trill</text>
      <text style={LABEL_STYLE} x="648" y="220" textAnchor="middle">Eb</text>
      <text style={LABEL_STYLE} x="730" y="132" textAnchor="start">C#</text>
      <text style={LABEL_STYLE} x="730" y="155" textAnchor="start">C</text>
      <text style={LABEL_STYLE} x="730" y="187" textAnchor="start">B foot</text>
    </svg>
  );
}

function SaxReference() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 500 759" style={{display:'block'}}>
      <style>{`.open{fill:none;stroke:#000;stroke-width:2.5;stroke-linecap:round;stroke-linejoin:round}.divider{stroke:#000;stroke-width:2.5;stroke-linecap:round}`}</style>

      <ellipse className="open" cx="182" cy="50" rx="30" ry="15" transform="rotate(-20,182,50)"/>
      <ellipse className="open" cx="305" cy="80" rx="16" ry="40" transform="rotate(-15,305,80)"/>
      <circle className="open" cx="182" cy="121" r="33"/>
      <ellipse className="open" cx="350" cy="120" rx="16" ry="38" transform="rotate(-15,350,120)"/>
      <ellipse className="open" cx="305" cy="160" rx="16" ry="38" transform="rotate(-15,305,160)"/>
      <ellipse className="open" cx="231" cy="165" rx="20" ry="17"/>
      <circle className="open" cx="181" cy="210" r="33"/>
      <circle className="open" cx="181" cy="300" r="33"/>
      <rect className="open" x="70" y="282" width="30" height="53" rx="8"/>
      <ellipse className="open" cx="276" cy="319" rx="44" ry="14"/>
      <ellipse className="open" cx="253" cy="355" rx="20" ry="18"/>
      <rect className="open" x="70" y="341" width="30" height="54" rx="8"/>
      <line className="divider" x1="148" y1="367" x2="214" y2="367"/>
      <ellipse className="open" cx="276" cy="395" rx="44" ry="14"/>
      <circle className="open" cx="182" cy="433" r="33"/>
      <rect className="open" x="70" y="405" width="30" height="54" rx="8"/>
      <circle className="open" cx="182" cy="525" r="33"/>
      <circle className="open" cx="181" cy="612" r="33"/>
      <ellipse className="open" cx="181" cy="679" rx="36" ry="14"/>
      <ellipse className="open" cx="182" cy="716" rx="35" ry="14"/>

      {/* Labels */}
      <text style={LABEL_STYLE} x="182" y="25" textAnchor="middle">Octave</text>
      <text style={LABEL_STYLE} x="370" y="60" textAnchor="start">Palm D</text>
      <text style={LABEL_STYLE} x="410" y="120" textAnchor="start">Side Bb</text>
      <text style={LABEL_STYLE} x="370" y="160" textAnchor="start">Side C</text>
      <text style={LABEL_STYLE} x="260" y="168" textAnchor="start">Bis/G#</text>
      <text style={LABEL_STYLE} x="182" y="85" textAnchor="middle">LH1</text>
      <text style={LABEL_STYLE} x="182" y="175" textAnchor="middle">LH2</text>
      <text style={LABEL_STYLE} x="181" y="268" textAnchor="middle">LH3</text>
      <text style={LABEL_STYLE} x="40" y="310" textAnchor="middle">Low B</text>
      <text style={LABEL_STYLE} x="40" y="370" textAnchor="middle">Low Bb</text>
      <text style={LABEL_STYLE} x="340" y="322" textAnchor="start">Side E</text>
      <text style={LABEL_STYLE} x="290" y="358" textAnchor="start">Side F#</text>
      <text style={LABEL_STYLE} x="182" y="400" textAnchor="middle">RH1</text>
      <text style={LABEL_STYLE} x="40" y="435" textAnchor="middle">Low C#</text>
      <text style={LABEL_STYLE} x="182" y="495" textAnchor="middle">RH2</text>
      <text style={LABEL_STYLE} x="181" y="580" textAnchor="middle">RH3</text>
      <text style={LABEL_STYLE} x="181" y="660" textAnchor="middle">Low Eb</text>
      <text style={LABEL_STYLE} x="182" y="740" textAnchor="middle">Low C</text>
    </svg>
  );
}

function ClarinetReference() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 440 858" style={{display:'block'}}>
      <style>{`.open{fill:none;stroke:#000;stroke-width:2.5;stroke-linecap:round;stroke-linejoin:round}.divider{stroke:#000;stroke-width:2.5;stroke-linecap:round}`}</style>

      <ellipse className="open" cx="138.9563" cy="88.777634" rx="16.542416" ry="34.739075"/>
      <path className="open" d="m 70.213369,100.90874 c 7.007988,37.82959 -6.007326,69.66195 -13.417738,69.66195 -7.410412,0 -20.886381,-31.92061 -13.417738,-69.66195 7.613477,-38.473238 14.995574,-73.237706 13.417738,-69.66196 -0.745607,1.689721 6.488012,32.254834 13.417738,69.66196 z"/>
      <path className="open" d="m 214.3162,107.5257 c 5.36976,42.88798 -4.28371,54.15327 -14.15296,53.85476 -11.35531,-0.34346 -25.46154,-26.45575 -13.41774,-52.75193 16.64403,-36.340232 -20.53206,-77.027994 2.75707,-64.883034 7.51772,3.920387 20.93176,32.77598 24.81363,63.780204 z"/>
      <circle className="open" cx="139" cy="171.33162" r="29"/>
      <circle className="open" cx="57.102825" cy="215.55785" r="29"/>
      <circle className="open" cx="139" cy="262.52185" r="29"/>
      <ellipse className="open" cx="68.299484" cy="381.76352" rx="16.358612" ry="8.8226223"/>
      <ellipse className="open" cx="68.682518" cy="405.8252" rx="16.358612" ry="8.8226223"/>
      <ellipse className="open" cx="67.823906" cy="430.47043" rx="16.358612" ry="8.8226223"/>
      <ellipse className="open" cx="68.137535" cy="456.42416" rx="16.358612" ry="8.8226223"/>
      <circle className="open" cx="139" cy="352.49612" r="29"/>
      <line className="divider" x1="110.3" y1="418.5" x2="167.3" y2="418.5"/>
      <circle className="open" cx="139" cy="483.79434" r="29"/>
      <circle className="open" cx="139" cy="576" r="29"/>

      {/* Labels */}
      <text style={LABEL_STYLE} x="175" y="75" textAnchor="start">Register key</text>
      <text style={LABEL_STYLE} x="25" y="100" textAnchor="middle">Thumb</text>
      <text style={LABEL_STYLE} x="250" y="130" textAnchor="start">A key</text>
      <text style={LABEL_STYLE} x="180" y="175" textAnchor="start">LH1</text>
      <text style={LABEL_STYLE} x="20" y="215" textAnchor="middle">LH2</text>
      <text style={LABEL_STYLE} x="180" y="266" textAnchor="start">LH3</text>
      <text style={LABEL_STYLE} x="180" y="356" textAnchor="start">RH1</text>
      <text style={LABEL_STYLE} x="25" y="385" textAnchor="middle">G#</text>
      <text style={LABEL_STYLE} x="25" y="409" textAnchor="middle">C#</text>
      <text style={LABEL_STYLE} x="25" y="434" textAnchor="middle">E/B</text>
      <text style={LABEL_STYLE} x="25" y="460" textAnchor="middle">Bb</text>
      <text style={LABEL_STYLE} x="180" y="487" textAnchor="start">RH2</text>
      <text style={LABEL_STYLE} x="180" y="580" textAnchor="start">RH3</text>
    </svg>
  );
}

function RecorderReference() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 220 440" style={{display:'block'}}>
      <style>{`.open{fill:none;stroke:#000;stroke-width:2.5;stroke-linecap:round;stroke-linejoin:round}.divider{stroke:#000;stroke-width:2.5;stroke-linecap:round}`}</style>

      <circle className="open" cx="60" cy="40" r="14"/>
      <line className="divider" x1="50" y1="68" x2="120" y2="68"/>
      <circle className="open" cx="90" cy="100" r="17"/>
      <circle className="open" cx="90" cy="148" r="17"/>
      <circle className="open" cx="90" cy="196" r="17"/>
      <line className="divider" x1="50" y1="228" x2="120" y2="228"/>
      <circle className="open" cx="90" cy="260" r="16"/>
      <circle className="open" cx="90" cy="305" r="16"/>
      <circle className="open" cx="90" cy="347" r="14"/>
      <circle className="open" cx="90" cy="385" r="13"/>

      <text style={LABEL_STYLE} x="82" y="44" textAnchor="start">  Thumb</text>
      <text style={LABEL_STYLE} x="118" y="104" textAnchor="start">LH1</text>
      <text style={LABEL_STYLE} x="118" y="152" textAnchor="start">LH2</text>
      <text style={LABEL_STYLE} x="118" y="200" textAnchor="start">LH3</text>
      <text style={LABEL_STYLE} x="118" y="264" textAnchor="start">RH1</text>
      <text style={LABEL_STYLE} x="118" y="309" textAnchor="start">RH2</text>
      <text style={LABEL_STYLE} x="118" y="351" textAnchor="start">RH3</text>
      <text style={LABEL_STYLE} x="118" y="389" textAnchor="start">RH4</text>
    </svg>
  );
}

function ValveReference() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 340 150" style={{display:'block'}}>
      <style>{`.open{fill:none;stroke:#000;stroke-width:3;stroke-linecap:round;stroke-linejoin:round}`}</style>
      <circle className="open" cx="70" cy="60" r="35"/>
      <text x="70" y="68" textAnchor="middle" fontSize="24" fontWeight="700" fontFamily="system-ui" fill="#000">1</text>
      <circle className="open" cx="170" cy="60" r="35"/>
      <text x="170" y="68" textAnchor="middle" fontSize="24" fontWeight="700" fontFamily="system-ui" fill="#000">2</text>
      <circle className="open" cx="270" cy="60" r="35"/>
      <text x="270" y="68" textAnchor="middle" fontSize="24" fontWeight="700" fontFamily="system-ui" fill="#000">3</text>
      <text style={LABEL_STYLE} x="70" y="115" textAnchor="middle">1st valve</text>
      <text style={SUB_STYLE} x="70" y="128" textAnchor="middle">(whole step)</text>
      <text style={LABEL_STYLE} x="170" y="115" textAnchor="middle">2nd valve</text>
      <text style={SUB_STYLE} x="170" y="128" textAnchor="middle">(half step)</text>
      <text style={LABEL_STYLE} x="270" y="115" textAnchor="middle">3rd valve</text>
      <text style={SUB_STYLE} x="270" y="128" textAnchor="middle">(1½ steps)</text>
    </svg>
  );
}

function SlideReference() {
  const POS_X = { 1: 50, 2: 112, 3: 174, 4: 236, 5: 298, 6: 360, 7: 422 };
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 460 120" style={{display:'block'}}>
      <style>{`.open{fill:none;stroke:#000;stroke-width:2.5;stroke-linecap:round;stroke-linejoin:round}`}</style>
      <rect className="open" x="20" y="20" width="420" height="40" rx="20"/>
      {[1,2,3,4,5,6,7].map(p => (
        <g key={p}>
          <line x1={POS_X[p]} y1="65" x2={POS_X[p]} y2="75" stroke="#000" strokeWidth="1"/>
          <text style={LABEL_STYLE} x={POS_X[p]} y="92" textAnchor="middle">{p}</text>
        </g>
      ))}
      <text style={SUB_STYLE} x="50" y="108" textAnchor="middle">In</text>
      <text style={SUB_STYLE} x="422" y="108" textAnchor="middle">Out</text>
    </svg>
  );
}

const REFERENCE_MAP = {
  'recorder': RecorderReference,
  'flute': FluteReference,
  'clarinet': ClarinetReference,
  'saxophone': SaxReference,
  'bb-trumpet': ValveReference,
  'french-horn': ValveReference,
  'euphonium': ValveReference,
  'bb-tuba': ValveReference,
  'trombone': SlideReference,
};

export default function KeyReference({ instrumentId }) {
  const Component = REFERENCE_MAP[instrumentId];
  if (!Component) return null;

  return (
    <div className="border border-[#e5e8ed] rounded-card p-5 mb-8 bg-white">
      <h3 className="text-sm font-bold text-[#4a5060] mb-3 text-center">Key Reference</h3>
      <div className="max-w-lg mx-auto">
        <Component />
      </div>
    </div>
  );
}
