package com.example.courseresgistartionsystem.JWT;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
public class JwtService {

    private String key="";

    public JwtService() throws NoSuchAlgorithmException {
        KeyGenerator keygen=KeyGenerator.getInstance("HmacSHA256");
        SecretKey sk=keygen.generateKey();
        key= Base64.getEncoder().encodeToString(sk.getEncoded());
    }

//    public Key getKey() {
//        return Keys.hmacShaKeyFor(key.getBytes(StandardCharsets.UTF_8));
//    }

    public String generateToken(String subject) {
        Map<String, Object> claims=new HashMap<>();
        return createtoken(claims,subject);
    }

    public String generateToken(UserDetails userDetails) {
        Map<String, Object> claims=new HashMap<>();
        return createtoken(claims,userDetails.getUsername());
    }

    private String createtoken(Map<String, Object> claims, String Username) {
        return Jwts.builder()
                .claims()
                .add(claims)
                .subject(Username)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 10))
                .and()
                .signWith(getsigningkey())
                .compact();

    }

    private Key getsigningkey() {
        return Keys.hmacShaKeyFor(key.getBytes(StandardCharsets.UTF_8));
    }

    public Boolean validateToken(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .setSigningKey(getsigningkey())  // now requires a `Key` object, not just a byte[]
                .build()
                .parseClaimsJws(token)
                .getBody();
    }


}
