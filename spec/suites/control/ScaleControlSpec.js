import {LeafletMap, ScaleControl} from 'leaflet';
import {createContainer, removeMapContainer} from '../SpecHelper.js';

describe('ScaleControl', () => {
	it('can be added to an unloaded map', () => {
		const map = new LeafletMap(document.createElement('div'));
		new ScaleControl().addTo(map);
	});

	describe('when the bar spans less than one unit', () => {
		let container, map, scale;

		beforeEach(() => {
			container = createContainer();
			map = new LeafletMap(container);
			scale = new ScaleControl().addTo(map);
		});

		afterEach(() => {
			removeMapContainer(map, container);
		});

		it('rounds down to a fraction of a meter', () => {
			map.setView([0, 0], 25); // 100px is 0.47 m

			expect(scale._mScale.textContent).to.equal('0.3 m');
			expect(scale._mScale.style.width).to.equal('64px');
		});

		it('rounds down to a fraction of a foot', () => {
			map.setView([0, 0], 27); // 100px is 0.38 ft

			expect(scale._iScale.textContent).to.equal('0.3 ft');
			expect(scale._iScale.style.width).to.equal('78px');
		});
	});

	it('keeps rounding whole numbers down', () => {
		const scale = new ScaleControl();

		for (const [num, rounded] of [[1, 1], [1.9, 1], [2.5, 2], [39, 30], [100, 100], [999, 500], [12345, 10000]]) {
			expect(scale._getRoundNum(num)).to.equal(rounded);
		}
	});
});
