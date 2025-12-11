document.querySelector("input[name='income']").oninput = function () {
    document.querySelector("#incomeText").innerHTML = readMoney(document.querySelector("input[name='income']").value)
    if (document.querySelector("#incomeText").innerHTML == "") {
        document.querySelector("#incomeText").innerHTML = "Không nhập sao mà tính đây"
        if (document.querySelector("input[name='taxDone']").value > 0) {
            document.querySelector("#taxDoneText").innerHTML = "Không làm ra tiền nhưng lại nộp thuế!! Điêu chắc luôn"
        }
    } else {
        document.querySelector("#taxDoneText").innerHTML = readMoney(document.querySelector("input[name='taxDone']").value)
    }
    calculate()
}
document.querySelector("input[name='npt']").oninput = function () {
    if (document.querySelector("input[name='npt']").value < 1) {
        document.querySelector("#nptText").innerHTML = "Không có thật à?"
    } else if (document.querySelector("input[name='npt']").value > 2
        && document.querySelector("input[name='npt']").value < 5) {
        document.querySelector("#nptText").innerHTML = "Xịn thật"
    } else if (document.querySelector("input[name='npt']").value >= 5) {
        document.querySelector("#nptText").innerHTML = "Thật không đó"
    } else {
        document.querySelector("#nptText").innerHTML = "Tốt cho bạn"
    }
    calculate()
}
document.querySelector("input[name='taxDone']").oninput = function () {
    document.querySelector("#taxDoneText").innerHTML = readMoney(document.querySelector("input[name='taxDone']").value)
    if (document.querySelector("#taxDoneText").innerHTML == "") {
        document.querySelector("#taxDoneText").innerHTML = "Đúng là không cần nhập thật mà"
    } else {
        if (document.querySelector("input[name='income']").value == 0) {
            document.querySelector("#taxDoneText").innerHTML = "Không làm ra tiền nhưng lại nộp thuế!! Điêu chắc luôn"
        }
    }
    calculate()
}

function readGroup(group) {
    let readDigit = [" Không", " Một", " Hai", " Ba", " Bốn", " Năm", " Sáu", " Bảy", " Tám", " Chín"];
    var temp = "";
    if (group == "000") return "";
    temp = readDigit[parseInt(group.substring(0, 1))] + " Trăm";
    if (group.substring(1, 2) == "0")
        if (group.substring(2, 3) == "0") return temp;
        else {
            temp += " Lẻ" + readDigit[parseInt(group.substring(2, 3))];
            return temp;
        }
    else
        temp += readDigit[parseInt(group.substring(1, 2))] + " Mươi";
    if (group.substring(2, 3) == "5") temp += " Lăm";
    else if (group.substring(2, 3) != "0") temp += readDigit[parseInt(group.substring(2, 3))];
    return temp;
}

function calculate() {
    // New tax regulations from 2026
    // let TAX_RATES = [0.05, 0.1, 0.2, 0.3, 0.35];
    // let TAX_BANDS = [10_000_000, 30_000_000, 60_000_000, 100_000_000, Infinity];
    // let INDIVIDUAL_DEDUCTION = 15_500_000;
    // let DEPENDENT_DEDUCTION = 6_200_000;

    let TAX_RATES = [0.05, 0.1, 0.15, 0.2, 0.25, 0.3, 0.35];
    let TAX_BANDS = [5_000_000, 10_000_000, 18_000_000, 32_000_000, 52_000_000, 80_000_000, Infinity];
    let INDIVIDUAL_DEDUCTION = 11_000_000;
    let DEPENDENT_DEDUCTION = 4_400_000;
    let income = document.querySelector("input[name='income']").value
    let npt = document.querySelector("input[name='npt']").value
    let taxDone = document.querySelector("input[name='taxDone']").value
    let eachMonth = income / 12 - INDIVIDUAL_DEDUCTION - npt * DEPENDENT_DEDUCTION
    let taxEachMonth = [];
    for (let i = 0; i < TAX_RATES.length; i++) {
        let lowerBound = i === 0 ? 0 : TAX_BANDS[i - 1];
        let upperBound = TAX_BANDS[i];
        
        if (eachMonth >= upperBound) {
            taxEachMonth.push((upperBound - lowerBound) * TAX_RATES[i]);
        } else if (eachMonth > lowerBound) {
            taxEachMonth.push((eachMonth - lowerBound) * TAX_RATES[i]);
        } else {
            taxEachMonth.push(0);
        }
    }
    let taxInEachRange = taxEachMonth.map(a => a > 0 ? a : 0).map(a => a * 12);
    let formatter = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    });
    for (let i = 0; i < TAX_RATES.length; i++) {
        if (taxInEachRange[i] > 0) {
            let ratePercent = (TAX_RATES[i] * 100) + '%';
            console.log(`Thuế suất ${ratePercent}: ${formatter.format(taxInEachRange[i])}`);
        }
    }
    let taxEachMonthTotal = taxInEachRange.reduce((a, b) => a + b)
    let total = Math.floor(taxEachMonthTotal)
    document.querySelector("#taxTotal").style.display = 'block'
    document.querySelector("#taxRemain").style.display = 'none'
    if (total > 0) {
        document.querySelector("#taxTotal").innerHTML = "Tổng số thuế: " + formatter.format(total);
        if (taxDone > 0) {
            document.querySelector("#taxRemain").style.display = 'block'
            if (total < taxDone) {
                document.querySelector("#taxRemain").innerHTML = "Bạn được hoàn lại: " + formatter.format(taxDone - total);
            } else if (total > taxDone) {
                document.querySelector("#taxRemain").innerHTML = "Bạn cần phải nộp thêm: " + formatter.format(total - taxDone);
            } else {
                document.querySelector("#taxRemain").innerHTML = "Bạn đã nộp vừa đủ thuế";
            }
        }
    } else {
        if (income == 0) {
            document.querySelector("#taxTotal").innerHTML = "Không có thu nhập thật luôn? Cả năm ở nhà chơi à?";
        } else {
            document.querySelector("#taxTotal").innerHTML = "Thu nhập dưới mức phải nộp thuế. Không biết nên vui hay buồn nữa";
        }
        if (taxDone > 0) {
            document.querySelector("#taxRemain").style.display = 'block'
            document.querySelector("#taxRemain").innerHTML = "Bạn được hoàn lại: " + formatter.format(taxDone - total) + ". Thích nhé";
        }
    }

    return total;
}
function readMoney(num) {
    if ((num == null) || (num == "")) return "";
    let temp = "";
    while (num.length < 18) {
        num = "0" + num;
    }
    let g1 = num.substring(0, 3);
    let g2 = num.substring(3, 6);
    let g3 = num.substring(6, 9);
    let g4 = num.substring(9, 12);
    let g5 = num.substring(12, 15);
    let g6 = num.substring(15, 18);
    if (g1 != "000") {
        temp = readGroup(g1);
        temp += " Triệu";
    }
    if (g2 != "000") {
        temp += readGroup(g2);
        temp += " Nghìn";
    }
    if (g3 != "000") {
        temp += readGroup(g3);
        temp += " Tỷ";
    } else if ("" != temp) {
        temp += " Tỷ";
    }
    if (g4 != "000") {
        temp += readGroup(g4);
        temp += " Triệu";
    }
    if (g5 != "000") {
        temp += readGroup(g5);
        temp += " Nghìn";
    }
    temp = temp + readGroup(g6);
    temp = temp.replaceAll("Một Mươi", "Mười");
    temp = temp.trim();
    temp = temp.replaceAll("Không Trăm", "");
    temp = temp.trim();
    temp = temp.replaceAll("Mười Không", "Mười");
    temp = temp.trim();
    temp = temp.replaceAll("Mươi Không", "Mươi");
    temp = temp.trim();
    if (temp.indexOf("Lẻ") == 0) temp = temp.substring(2);
    temp = temp.trim();
    temp = temp.replaceAll("Mươi Một", "Mươi Mốt");
    temp = temp.trim();
    let result = temp.substring(0, 1).toUpperCase() + temp.substring(1).toLowerCase();
    return (result == "" ? "Không" : result) + " đồng chẵn"
}