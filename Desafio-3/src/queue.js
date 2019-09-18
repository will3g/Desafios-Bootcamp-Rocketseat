// Dessa forma a fila nunca vai interferir no desempenho
// de sua aplicação em node, pois está "isolado" da pasta lib (mais ou menos)

import Queue from './lib/Queue';

Queue.processQueue();