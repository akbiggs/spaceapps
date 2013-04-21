from kartograph import Kartograph
from collections import OrderedDict

c = {
        'layers': {
            'provinces': {
                'src': '../../nd/ne_10m_admin_1_states_provinces_shp.shp',
                'attributes': {
                    'id': 'adm1_code',
                    }
                }
            },
}
c['layers'] = OrderedDict(c['layers'])
K = Kartograph()
K.generate(c, outfile='simp.svg')
