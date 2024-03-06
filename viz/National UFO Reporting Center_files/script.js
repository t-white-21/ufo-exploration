function resetme(form) {
    jQuery(form).find("select.state_auto,select.city_auto").attr('disabled', false).fadeIn();
    jQuery(form).find('#hidden_state,#hidden_city').fadeOut().attr('disabled', true);
    jQuery(form).find('.resetme').fadeOut();
}

jQuery(function ($) {
    /*------ FUNCTION START FOR CONTACT FORM 7 ------*/
    jQuery("select.country_auto").each(function (i) {
    $("select.country_auto[i]").change(function (i) {
        var form = $(this).closest("form");
        resetme(form);
        // var form = $(this).closest("form");
        if ($(this).closest("form").find("select.state_auto").length > 0) {
            var cid = $(form).find("select.country_auto").children("option:selected").attr('data-id');
            var state_placeholder = $(form).find("select.state_auto option:first-child").html();
            var city_placeholder = $(form).find("select.city_auto option:first-child").html();
            if (cid == '0') {
                $(form).find("select.state_auto").html('<option value="0" data-id="0">' + state_placeholder + '</option>');
                return false;
            }
            $(form).find("select.state_auto").html('<option id="loading" value="0001">Loading...</option><option value="0" data-id="0">' + state_placeholder + '</option>');
            $(form).find("select.city_auto").html('<option value="0">' + city_placeholder + '</option>');
            var st_ot = 'Other State';
            var st_ot = $(form).find("select.state_auto").attr('data-other');
            jQuery.ajax({
                url: tc_pro_csca_auto_ajax.ajax_url,
                type: 'post',
                dataType: "html",
                data: { action: "tc_pro_csca_get_states", nonce_ajax: tc_pro_csca_auto_ajax.nonce, cid: cid },
                success: function (response) {
                    var res = JSON.parse(response);
                    if (res.length > 0) {
                        for (i = 0; i < res.length; i++) {
                            var st_id = res[i].id;
                            var st_name = res[i].name;
                            var cnt_id = res[i].country_id;
                            st_name = st_name.replace(/'/g, "&apos;");
                            var opt = "<option data-id='" + st_id + "' value='" + st_name + "'>" + st_name + "</option>";
                            $(form).find("select.state_auto option#loading").remove();
                            $(form).find("select.state_auto").append(opt);
                        }
                        var opt = "<option data-id='other' value='other'>" + st_ot + "</option>";
                        $(form).find("select.state_auto").append(opt);
                    }
                    else {
                        var opt = "<option data-id='other' value='other'>" + st_ot + "</option>";
                        $(form).find("select.state_auto option#loading").remove();
                        $(form).find("select.state_auto").append(opt);
                    }
                }


            });
        }
    });
});
    /*---- FUNCTION TO APPEND CITIES ----*/
    jQuery("select.state_auto").each(function (i) {
    $("select.state_auto[i]").change(function (i) {
        var form = $(this).closest("form");
        if ($(this).closest("form").find("select.state_auto").children("option:selected").val() == 'other') {
            // console.log(form);
            $(form).find('#hidden_state,#hidden_city').fadeIn().attr('disabled', false);
            $(form).find('select.state_auto,select.city_auto').attr("disabled", true).fadeOut();
            //$(form).find('.hiddn_stat,.hidd_city').attr('disabled',false);
            $(form).find('.resetme.state').fadeIn();
            $(form).find('.resetme.state').on('click', function () {
                resetme(form);
                $(form).find('select.state_auto,select.city_auto').val(0);
            });
        }

        if ($(this).closest("form").find("select.city_auto").length > 0) {
            var cid = $(form).find("select.country_auto").children("option:selected").attr('data-id');
            var sid = $(form).find("select.state_auto").children("option:selected").attr('data-id');
            var sstate_value = $("select.country_auto").attr('data_state');
            var matched_value = $(form).find("select.state_auto").children("option:selected").val();
            //var state_placeholder=$(form).find("select.state_auto option:first-child").html();
            var state_placeholder = $(form).find("select.state_auto option:first-child").html();
            var city_placeholder = $(form).find("select.city_auto option:first-child").html();
            $(form).find("select.city_auto").html('<option id="loading" value="0001">Loading...</option><option value="0">' + city_placeholder + '</option>');
            var ct_ot = 'Other City';
            var ct_ot = $(form).find("select.city_auto").attr('data-other');
            //console.log(sid);
            if (sid != 'other' && sid != '0') {
                jQuery.ajax({
                    url: tc_pro_csca_auto_ajax.ajax_url,
                    type: 'post',
                    dataType: "html",
                    data: { action: "tc_pro_csca_get_cities", nonce_ajax: tc_pro_csca_auto_ajax.nonce, sid: sid },
                    success: function (response) {
                        //console.log(response);	
                        var res = JSON.parse(response);
                        if (res.length > 0) {
                            for (i = 0; i < res.length; i++) {
                                var ct_id = res[i].id;
                                var ct_name = res[i].name;
                                ct_name = ct_name.replace(/'/g, "&apos;");
                                var st_id = res[i].country_id;
                                var opt = "<option data-id='" + ct_id + "' value='" + ct_name + "'>" + ct_name + "</option>";
                                $(form).find("select.city_auto option#loading").remove();
                                $(form).find("select.city_auto").append(opt);
                            }
                            var opt = "<option data-id='other' value='other'>" + ct_ot + "</option>";
                            $(form).find("select.city_auto").append(opt);

                            if ($(form).find("select.city_auto").attr("disabled")) {
                                resetme(form);
                            }

                        }
                        else {
                            $(form).find("select.city_auto option#loading").remove();
                            var opt = "<option data-id='other' value='other'>" + ct_ot + "</option>";
                            $(form).find("select.city_auto").append(opt);
                        }
                    }

                });

            }
            else {
                $(form).find("select.city_auto option#loading").remove();
                $(form).find('.resetme.city').fadeOut();
                // if (sid != '0') {
                //     var opt = "<option data-id='other' value='other'>" + ct_ot + "</option>";
                //     //$(form).find("select.city_auto").append(opt);
                // }
            }
        }
    });
});

    /*---- FUNCTION TO OTHER CITIES ----*/
    $("select.city_auto").change(function (i) {
        var form = $(this).closest("form");
        if ($(this).closest("form").find("select.city_auto").children("option:selected").val() == 'other') {

            $(form).find('select.city_auto').fadeOut().attr('disabled', true);
            $(form).find('#hidden_city,.resetme.city').show();
            $(form).find('#hidden_city').attr('disabled', false)
            $(form).find('.resetme.city').on('click', function () {
                //	console.log('ok');
                $(form).find('select.city_auto').fadeIn().val(0);
                $(form).find('#hidden_city,.resetme.city').fadeOut();
                $(form).find('select.city_auto').attr('disabled', false);
                $(form).find('#hidden_city').attr('disabled', true);


            });
        }
    });

    /*::::::------ FUNCTION END FOR CONTACT FORM 7 ------::::::*/


    /*:::::: FUNCTION START FOR OTHERS FORMS/FIELDS ::::::*/
    if (tc_pro_csca_auto_ajax.data) {
        $data = tc_pro_csca_auto_ajax.data;
        //  console.log($data); 
        $country_id = $data['country_id'];
        $state_id = $data['state_id'];
        $city_id = $data['city_id'];
        $country_place = $data['country_place'];
        $state_place = $data['state_place'];
        $city_place = $data['city_place'];
        $sepcific_country = $data['select_specific'];
        $default_country = $data['default_country'];
        $other_state = $data['other_state'];
        $other_city = $data['other_city'];
        // console.log($default_country,"DC");
        // console.log($sepcific_country);
    }
    else {
        return;
    }
    $st_name = '';
    $ct_name = '';
    $country_id = $country_id.split(",");
    $state_id = $state_id.split(",");
    $city_id = $city_id.split(",");
    //console.log($country_id, $state_id, $city_id);
    jQuery($country_id).each(function (i) {
        $($country_id[i]).html("<option value='0' data-id='0'>" + $country_place + "</option>");
    });

    jQuery($state_id).each(function (i) {
        $st_name = jQuery($state_id[i]).attr('name');
        $($state_id[i]).html("<option value='0' data-id='0'>" + $state_place + "</option>");
        appendOtherFieldsState($st_name, $state_id[i], $other_state, i);
    });

    jQuery($city_id).each(function (i) {
        $ct_name = jQuery($city_id[i]).attr('name');
        $($city_id[i]).html("<option value='0' data-id='0'>" + $city_place + "</option>");
        appendOtherFieldsCity($ct_name, $city_id[i], $other_city, i);
    });

    if ($country_id == 'select') {
        //console.log('Id not found.');
        return false;
    }

    jQuery.ajax({
        url: tc_pro_csca_auto_ajax.ajax_url,
        type: 'post',
        dataType: "html",
        data: { action: "tc_pro_csca_get_countries", nonce_ajax: tc_pro_csca_auto_ajax.nonce },
        success: function (response) {
            //console.log(response);
            $res = JSON.parse(response);
            //console.log($res,'responce');
            if ($res['countries'].length > 0) {
                if ($sepcific_country && $sepcific_country.length > 0) {
                    //console.log("in!!");
                    jQuery($country_id).each(function (i) {
                        appendCountries($res, 'specific', $country_id[i]);
                    });
                }
                else {
                    //  console.log("test", $country_id);
                    appendCountries($res, 'All', $country_id);
                }

                jQuery($country_id).each(function (i) {
                    setDefaultCountry($default_country, $country_id[i]);
                });

                if ($state_id == 'select') {
                    return false;
                }
                if ($res['states'].length > 0) {
                    //console.log($state_id);
                    appendStates($res['states'], $state_id, $other_state);
                }
            }
            else {
                console.log('Countries are not selected.');
            }
        }
    });
    //console.log($country_id,$state_id,$city_id);
    /* START :::: ON CHANGE EVENT FUNCTIONS */
    jQuery($country_id).each(function (i) {
        jQuery($country_id[i]).change(function () {
            $form = $(this).closest("form");
            $cid = $(this).children("option:selected").attr('data-id');
            $city_id_new = jQuery($form).find($city_id[i]);
            $state_id_new = $($form).find($state_id[i]);
            //console.log($cid,"cccid");
            if ($cid == '0') {
                //return false;
                if ($state_id[i] != 'select') {
                    $($state_id[i]).html("<option value='0' data-id='0'>" + $state_place + "</option>");
                }
                if ($city_id[i] != 'select') {
                    $($city_id[i]).html("<option value='0' data-id='0'>" + $city_place + "</option>");
                }
                return false;
            }
            else {
                if ($state_id[i] !== 'select') {
                    $($state_id[i]).removeAttr("disabled").fadeIn();
                    ctid = $city_id[i];
                    $st_fld_name = $($state_id[i]).attr("name");
                    $ct_fld_name = $($city_id[i]).attr("name");
                    // console.log($st_fld_name,$st_fld_id);
                    $st_fld_id = $($form).find("input.otherstate[name='" + $st_fld_name + "']").attr("data-id");
                    resetStateCity($st_fld_name, $ct_fld_name, $city_place, ctid);
                }
            }
           
            if ($state_id == 'select') {
                return false;
            }

            if (jQuery($state_id[i]).length > 0) {
                appendDynamicStates($cid, $state_id[i], $state_place, $other_state);
            }
            else {
               
                appendDynamicOnlyCities($cid, $other_city, $city_id_new, $(this));
                //console.log($cid, $other_city, $city_id_new, $city_place);

            }
        });
    });

    if ($state_id != 'select') {
        //console.log('state in');
        jQuery($state_id).each(function (i) {
            jQuery($state_id[i]).change(function () {
                $form = $(this).closest("form");
                $sid = $(this).children("option:selected").attr('data-id');
                //console.log($sid);
                if ($sid == '0') {
                    $($city_id[i]).html("<option value='0' data-id='0'>" + $city_place + "</option>");
                    return false;
                }
                if ($sid == 'otherstate') {
                    $($state_id[i]).attr("disabled", "disabled").fadeOut();
                    $st_fld_name = $($state_id[i]).attr("name");
                    //console.log($st_fld_name);
                    $($form).find("input.otherstate[name='" + $st_fld_name + "']").fadeIn().removeAttr('disabled').removeClass('csca_hide');
                    if ($city_id[i] !== 'select') {
                        $($city_id[i]).attr("disabled", "disabled").fadeOut();
                        $ct_fld_name = $($city_id[i]).attr("name");
                        $ct_fld_id = $($form).find("input.othercity[name='" + $ct_fld_name + "']").attr("data-id");
                        //console.log($ct_fld_name, $ct_fld_id);
                        $($form).find("input.othercity[name='" + $ct_fld_name + "']").fadeIn().removeAttr('disabled').removeClass('csca_hide');
                    }
                    // $($form).find("a.csca_reset").fadeIn().removeClass('csca_hide');
                    $($form).find("a.csca_reset[name='" + $st_fld_name + "']").fadeIn().removeClass('csca_hide');
                    $($form).find("a.csca_reset[name='" + $ct_fld_name + "']").fadeOut().addClass('csca_hide');
                    return false;
                }
                /* USE THIS ELSE FOR SCENARIO ON CHANGE OTHER STATE TO  PRESENT STATE */
                else {
                    if ($city_id[i] !== 'select') {
                        $($city_id[i]).removeAttr("disabled").fadeIn();
                        $ct_fld_name = $($city_id[i]).attr("name");
                        $ct_fld_id = $($form).find("input.othercity[name='" + $ct_fld_name + "']").attr("data-id");
                        //console.log($ct_fld_name,$ct_fld_id);
                        resetCity($ct_fld_name);
                    }
                }

                if (jQuery($city_id[i]).length > 0) {
                    if ($city_id[i] == 'select') {
                        return false;
                    }
                    appendDynamicCities($sid, $city_id[i], $city_place, $other_city);
                }
            });
        });
    }

    if ($city_id != 'select') {
        jQuery($city_id).each(function (i) {
            jQuery($city_id[i]).change(function () {
                $form = $(this).closest("form");
                $city_id_new = jQuery($form).find($city_id[i]);
                $state_id_new = $($form).find($state_id[i]);
                $cid = $(this).children("option:selected").attr('data-id');
                //console.log($cid,"cityId");
                if ($cid == 'othercity') {
                    $($city_id[i]).attr("disabled", "disabled").fadeOut();
                    $ct_fld_name = $($city_id[i]).attr("name");
                    $($form).find("input.othercity[name='" + $ct_fld_name + "']").fadeIn().removeAttr('disabled').removeClass('csca_hide');
                    $($form).find("a.csca_reset_city[name='" + $ct_fld_name + "']").fadeIn().removeClass('csca_hide');
                    return false;
                }

            });
        });
    }
    /* END :::: ON CHANGE EVENT FUNCTIONS */

    /*------ FUNCTION END FOR OTHERS FORMS/FIELDS ------*/

    /*::::: FUNCTION START FOR RESET BUTTONS :::::*/
    jQuery(".csca_reset_state").click(function (e) {
        st_attr_name = $(this).attr("name");
        $st_data_id = $(this).attr("data-id");
        $ct_name = $('input.othercity[data-id="' + $st_data_id + '"]').attr("name");
        jQuery(this).closest('form').find("input.otherstate[name='" + st_attr_name + "']").fadeOut().addClass('csca_hide').attr('disabled', 'disabled');
        jQuery(this).closest('form').find("select[name='" + st_attr_name + "']").removeAttr('disabled').fadeIn().val('0');
        jQuery(this).closest('form').find('input.othercity[data-id="' + $st_data_id + '"]').fadeOut().addClass('csca_hide').attr('disabled', 'disabled');
        jQuery(this).closest('form').find('select[name="' + $ct_name + '"]').removeAttr('disabled').fadeIn().removeClass('csca_hide').val('0');

        jQuery(this).closest('form').find('select[name="' + $ct_name + '"]').html("<option value='0' data-id='0'>" + $city_place + "</option>");
        jQuery(this).closest('form').find("a.csca_reset[name='" + st_attr_name + "']").fadeOut();
        e.preventDefault();
    });
    /*::::: CITY RESET BUTTON  :::::*/
    jQuery(".csca_reset_city").click(function (e) {
        ct_attr_name = $(this).attr("name");
        jQuery(this).closest('form').find("input.othercity[name='" + ct_attr_name + "']").fadeOut().addClass('csca_hide').attr('disabled', 'disabled');
        jQuery(this).siblings("select[name='" + ct_attr_name + "']").fadeIn().removeAttr('disabled').val('0');
        jQuery(this).closest('form').find("a.csca_reset_city[name='" + ct_attr_name + "']").fadeOut();
        e.preventDefault();
    });

});


function appendCountries(res, type, country_id) {
    //console.log(res, type, country_id);
    if (type == 'specific') {
        for (i = 0; i < res['countries'].length; i++) {
            //console.log(res['countries'][i]);
            var ct_id = res['countries'][i][0].id;
            var ct_name = res['countries'][i][0].name;
            var opt = "<option data-id='" + ct_id + "' value='" + ct_name + "'>" + ct_name + "</option>";
            jQuery(country_id).each(function () {
                jQuery(this).append(opt);
            });
        }
    }
    else {
        // console.log(res['countries']);
        for (i = 0; i < res['countries'].length; i++) {
            var ct_id = res['countries'][i].id;
            var ct_name = res['countries'][i].name;
            var opt = "<option data-id='" + ct_id + "' value='" + ct_name + "'>" + ct_name + "</option>";
            //console.log(country_id);
            jQuery(country_id).each(function (i) {
                jQuery(country_id[i]).append(opt);
            })

        }
    }
}

function setDefaultCountry($default_country, $country_id) {
    //console.log($default_country, $country_id);
    if ($default_country) {
        jQuery($country_id).find("option").each(function () {
            if (jQuery(this).data("id") == $default_country) {
                jQuery(this).attr('selected', "selected").trigger("change");
            }
        });

    }
}

function appendStates(res, state_id, $other_state) {
    for (i = 0; i < res.length; i++) {
        var ct_id = res[i].id;
        var ct_name = res[i].name;
        var opt = "<option data-id='" + ct_id + "' value='" + ct_name + "'>" + ct_name + "</option>";
        //console.log(ct_id,ct_name);
        jQuery(state_id).each(function (i) {
            jQuery(state_id[i]).append(opt);
        })
    }
    jQuery(state_id).each(function (i) {
        jQuery(state_id[i]).append("<option value='otherstate' data-id='otherstate'>" + $other_state + "</option>");
    });
}
function appendDynamicStates($cid, $state_id, $state_place, $other_state) {
    jQuery($state_id).html('').append("<option value='0'>Loading...</option>");
    jQuery.ajax({
        url: tc_pro_csca_auto_ajax.ajax_url,
        type: 'post',
        dataType: "html",
        data: { action: "tc_pro_csca_get_states", nonce_ajax: tc_pro_csca_auto_ajax.nonce, cid: $cid },
        success: function (response) {
            $res = JSON.parse(response);
            if ($res.length > 0) {
                jQuery($state_id).html('').append("<option value='0' data-id='0'>" + $state_place + "</option>");
                for (i = 0; i < $res.length; i++) {
                    $st_id = $res[i].id;
                    $st_name = $res[i].name;
                    $cnt_id = $res[i].country_id;
                    $opt = "<option data-id='" + $st_id + "' value='" + $st_name + "'>" + $st_name + "</option>";
                    jQuery($state_id).append($opt);
                    //$(form).find("select.state_auto").append(opt);	
                }
                jQuery($state_id).append("<option value='otherstate' data-id='otherstate'>" + $other_state + "</option>");

            }
            else {
                jQuery($state_id).html('').append("<option value='0' data-id='0'>" + $state_place + "</option>");
                jQuery($state_id).append("<option value='otherstate' data-id='otherstate'>" + $other_state + "</option>");
                console.log('State List Not Found');
            }
        }
    });
}

function appendDynamicCities($sid, $city_id, $city_place, $other_city) {
    jQuery($city_id).html('').append("<option value='0' data-id='0'>Loading...</option>");
    jQuery.ajax({
        url: tc_pro_csca_auto_ajax.ajax_url,
        type: 'post',
        dataType: "html",
        data: { action: "tc_pro_csca_get_cities", nonce_ajax: tc_pro_csca_auto_ajax.nonce, sid: $sid },
        success: function (response) {
            //console.log(response);
            $res = JSON.parse(response);
            if ($res.length > 0) {
                jQuery($city_id).html("<option value='0' data-id='0'>" + $city_place + "</option>");
                for (i = 0; i < $res.length; i++) {
                    $ct_id = $res[i].id;
                    $ct_name = $res[i].name;
                    $st_id = $res[i].country_id;
                    $opt = "<option data-id='" + $ct_id + "' value='" + $ct_name + "'>" + $ct_name + "</option>";
                    // console.log($opt);
                    jQuery($city_id).append($opt);
                    //$(form).find("select.city_auto option#loading").remove();	
                    //$(form).find("select.city_auto").append(opt);
                }
                jQuery($city_id).append("<option value='othercity' data-id='othercity'>" + $other_city + "</option>");
            }
            else {
                jQuery($city_id).html("<option value='0' data-id='0'>" + $city_place + "</option>");
                jQuery($city_id).append("<option value='othercity' data-id='othercity'>" + $other_city + "</option>");
                console.log('Cities List Not Found');
            }
        }

    });
}

/**********************************************************************************************
 * 
 * 
 * 
 *                     MISC FUNCTIONS 
 * 
 * 
 * 
 * *********************************************************************************************
*/


// function appendDynamicOnlyCitiesReady($cid, $other_city, thisdiv) {

//     // console.log($cid,$other_city,$city_id,thisdiv);
//     jQuery(thisdiv).html('').append("<option value='0'>Loading...</option>");
//     jQuery.ajax({
//         url: tc_pro_csca_auto_ajax.ajax_url,
//         type: 'post',
//         dataType: "html",
//         data: { action: "tc_pro_csca_get_cities_only", nonce_ajax: tc_pro_csca_auto_ajax.nonce, cid: $cid },
//         success: function (response) {
//             //console.log(response);	
//             $res = JSON.parse(response);
//             //         console.log($res);	
//             if ($res.length > 0) {
//                 jQuery(thisdiv).html('');
//                 for (i = 0; i < $res.length; i++) {
//                     //console.log($res.length);
//                     $d = $res[i];
//                     for (j = 0; j < $d.length; j++) {
//                         $ct_id = $d[j].id;
//                         $ct_name = $d[j].name;
//                         $st_id = $d[j].country_id;
//                         $opt = "<option data-id='" + $ct_id + "' value='" + $ct_name + "'>" + $ct_name + "</option>";
//                         // console.log($opt);
//                         jQuery(thisdiv).append($opt);
//                     }
//                 }
//                 var select = jQuery(thisdiv);
//                 select.html(select.find('option').sort(function (x, y) {
//                     // to change to descending order switch "<" for ">"
//                     return jQuery(x).text() > jQuery(y).text() ? 1 : -1;
//                 }));
//                 select.val("option:first-child");
//                 jQuery(thisdiv).append("<option value='othercity' data-id='othercity'>" + $other_city + "</option>");
//             }
//             else {
//                 console.log('Cities List Not Found');
//             }
//         }

//     });
// }

function appendDynamicOnlyCities($cid, $other_city, $city_id, thisdiv) {
    //console.log($cid,$other_city,$city_id,thisdiv);
    jQuery(thisdiv).closest('form').find($city_id).html("<option value='0'>Loading...</option>");
    jQuery.ajax({
        url: tc_pro_csca_auto_ajax.ajax_url,
        type: 'post',
        dataType: "html",
        data: { action: "tc_pro_csca_get_cities_only", nonce_ajax: tc_pro_csca_auto_ajax.nonce, cid: $cid },
        success: function (response) {
            //console.log(response);	
            $res = JSON.parse(response);
             //console.log($res);	

            if ($res && $res.length > 0) {
                console.log($res.length);
                for (i = 0; i < $res.length; i++) {
                    $d = $res[i];
                    for (j = 0; j < $d.length; j++) {
                        $ct_id = $d[j].id;
                        $ct_name = $d[j].name;
                        $st_id = $d[j].country_id;
                        $opt = "<option data-id='" + $ct_id + "' value='" + $ct_name + "'>" + $ct_name + "</option>";
                        jQuery(thisdiv).closest('form').find($city_id).append($opt);
                    }
                }
                var select = jQuery(thisdiv).closest('form').find($city_id);
                select.html(select.find('option').sort(function (x, y) {
                    // to change to descending order switch "<" for ">"
                    return jQuery(x).text() > jQuery(y).text() ? 1 : -1;
                }));
                select.val("option:first-child");
                jQuery(thisdiv).closest('form').find($city_id).prepend("<option value='0' data-id='0'>" + $city_place + "</option>");
                jQuery(thisdiv).closest('form').find($city_id).append("<option value='othercity' data-id='othercity'>" + $other_city + "</option>");
            }
            else{
                jQuery(thisdiv).closest('form').find($city_id).html('');
                jQuery(thisdiv).closest('form').find($city_id).prepend("<option value='0' data-id='0'>" + $city_place + "</option>");
                $opt = "<option value='othercity' data-id='othercity'>" + $other_city + "</option>";
                jQuery(thisdiv).closest('form').find($city_id).append($opt);
                console.log('Cities List Not Found');
            }
        }

    });
}
/************************************************************************************/


function appendOtherFieldsState($st_name, $state_id, $other_state, i) {
    jQuery('<input type="text" name="' + $st_name + '" data-id="' + i + '" class="otherstate csca_hide" placeholder="' + $other_state + '" disabled><a class="csca_reset csca_reset_state csca_hide"  name="' + $st_name + '" data-id="' + i + '" href="#">Reset</a>').insertAfter($state_id);

}
function appendOtherFieldsCity($ct_name, $city_id, $other_city, i) {
    if ($city_id !== 'select') {
        jQuery('<input type="text" name="' + $ct_name + '" data-id="' + i + '" class="othercity csca_hide" placeholder="' + $other_city + '" disabled><a class="csca_reset csca_reset_city csca_hide" name="' + $ct_name + '" data-id="' + i + '" href="#">Reset</a>').insertAfter($city_id);
    }

}

/* On Change country One To Other the Reset State and City Field */
function resetStateCity($st_fld_name, $ct_fld_name, $city_place, ctid) {

    jQuery($form).find("input.otherstate[name='" + $st_fld_name + "']").fadeOut().attr('disabled', 'disabled').addClass('csca_hide');
    jQuery($form).find("a.csca_reset[name='" + $st_fld_name + "']").fadeOut().addClass('csca_hide');

    jQuery($form).find("input.othercity[name='" + $ct_fld_name + "']").fadeOut().attr('disabled', 'disabled').addClass('csca_hide');
    jQuery(ctid).removeAttr("disabled").fadeIn();
    jQuery(ctid).html("<option value='0' data-id='0'>" + $city_place + "</option>");
    jQuery($form).find("a.csca_reset[name='" + $ct_fld_name + "']").fadeOut().addClass('csca_hide');

}

/* On Change State One To Other the Reset  City Field */
function resetCity($ct_fld_name) {
    jQuery($form).find("input.othercity[name='" + $ct_fld_name + "']").fadeOut().attr('disabled', 'disabled').addClass('csca_hide');
    jQuery($form).find("a.csca_reset[name='" + $ct_fld_name + "']").fadeOut().addClass('csca_hide');
}



