google.maps.__gjsload__('overlay', '\'use strict\';function NA(a){this.j=a}w(NA,K);NA.prototype.changed=function(a){"outProjection"!=a&&(a=!!(this.get("offset")&&this.get("projectionTopLeft")&&this.get("projection")&&C(this.get("zoom"))),a==!this.get("outProjection")&&this.set("outProjection",a?this.j:null))};function OA(){}function PA(){var a=this.gm_props_;if(this.getPanes()){if(this.getProjection()){if(!a.Bg&&this.onAdd)this.onAdd();a.Bg=!0;this.draw()}}else{if(a.Bg)if(this.onRemove)this.onRemove();else this.remove();a.Bg=!1}}function QA(a){a.gm_props_=a.gm_props_||new OA;return a.gm_props_}function RA(a){V.call(this);this.Da=t(PA,a)}w(RA,V);function SA(){}\nSA.prototype.tn=function(a){var b=a.getMap(),c=QA(a),d=c.oh;c.oh=b;d&&(c=QA(a),(d=c.Sa)&&d.unbindAll(),(d=c.nk)&&d.unbindAll(),a.unbindAll(),a.set("panes",null),a.set("projection",null),G(c.ra,H.removeListener),c.ra=null,c.Jb&&(c.Jb.Da(),c.Jb=null),Wl("Ox","-p",a));if(b){c=QA(a);d=c.Jb;d||(d=c.Jb=new RA(a));G(c.ra,H.removeListener);var e=c.Sa=c.Sa||new Vk,f=b.__gm;e.bindTo("zoom",f);e.bindTo("offset",f);e.bindTo("center",f,"projectionCenterQ");e.bindTo("projection",b);e.bindTo("projectionTopLeft",f);\ne=c.nk=c.nk||new NA(e);e.bindTo("zoom",f);e.bindTo("offset",f);e.bindTo("projection",b);e.bindTo("projectionTopLeft",f);a.bindTo("projection",e,"outProjection");a.bindTo("panes",f);e=t(d.ta,d);c.ra=[H.addListener(a,"panes_changed",e),H.addListener(f,"zoom_changed",e),H.addListener(f,"offset_changed",e),H.addListener(b,"projection_changed",e),H.addListener(f,"projectioncenterq_changed",e),H.forward(b,"forceredraw",d)];d.ta();b instanceof Ld&&(Z(b,"Ox"),Vl("Ox","-p",a,!!b.wa))}};var TA=new SA;fe.overlay=function(a){eval(a)};uc("overlay",TA);\n')